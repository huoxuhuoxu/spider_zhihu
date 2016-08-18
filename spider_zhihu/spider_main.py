#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import time, threading, multiprocessing
from spider_class import UrlHandler,OutputHandler,ParserHandler,DownloaderHandler

'''
    @ args
    url: 爬虫入口
    max_count: 需要爬取的数量
    success_count: 成功的数量
    total_thread: 启用线程数
'''

url = "https://www.zhihu.com/"
max_count = 100


success_count = 0
total_thread = 10

'''
    @ 多线程 爬虫
    利用 lock/queue 锁/列队 实现
    如果列队
    不为空: 执行,
    为空: 跳过,等待下一轮

    @! 改:
    线程间通信 本进程资源共享,不需要使用列队,并且列队不重写不能克服重复数据的问题
    所有线程共享url管理器
    一旦出现429或者其他错误,将url重新加入url管理器内,重抓
    添加性别/未抓取/已抓起 存储
'''
lock = threading.Lock()
queue = UrlHandler()
queue.add_new_url(url)

class SpiderMain2(object):
    def __init__(self):
        self.down_handler = DownloaderHandler()
        self.parser_handler = ParserHandler()
        self.outhandler = OutputHandler()

    def main(self):
        global success_count
        global max_count
        print("开始")
        while success_count < max_count:
            try:
                lock.acquire()
                if not queue.has_get_url():
                    lock.release()
                    continue
                success_count += 1
                new_url = queue.get_new_url()
                lock.release()
                if not new_url:
                    continue

                time.sleep(1)
                docs = self.down_handler.downloader_url(new_url)

                lock.acquire()
                if not docs:
                    queue.add_new_url_spical(new_url)
                    urls, data = None, ''
                else:
                    urls, data = self.parser_handler.parser_html(docs, new_url)

                queue.add_new_urls(urls)
                if data:
                    self.outhandler.add_data(data)
                lock.release()

                print("url:%r爬取,当前线程为%s" % (new_url, threading.current_thread().name))

            except Exception as err:
                print(str(err))
                lock.release()

        lock.acquire()
        self.outhandler.out_text2()
        lock.release()


class MyThreading(threading.Thread):

    def __init__(self):
        super(MyThreading, self).__init__()

    def run(self):
        u = SpiderMain2()
        u.main()


'''
    @ 单线程 爬虫
'''
class SpiderMain(object):

    def __init__(self):
        self.url_handler = UrlHandler()
        self.down_handler = DownloaderHandler()
        self.parser_handler = ParserHandler()
        self.outhandler = OutputHandler()

    def main(self, url):
        global max_count
        self.url_handler.add_new_url(url)
        count = 0
        succ_count = 0

        while self.url_handler.has_get_url():
            count += 1
            try:
                new_url = self.url_handler.get_new_url()
                docs = self.down_handler.downloader_url(new_url)
                urls, data = self.parser_handler.parser_html(docs, new_url)
                self.url_handler.add_new_urls(urls)

            except Exception as err:
                print("url:%r,爬取失败,%s" % (new_url, str(err)))
                error_obj = {
                    "url": new_url,
                    "error_info": str(err)
                }
                self.outhandler.err_list.append(error_obj)

            else:
                print("url:%r爬取,第%d个" % (new_url, count))
                succ_count += 1
                if data:
                    self.outhandler.add_data(data)

            if count >= max_count:
                self.outhandler.out_text()
                break

        a = "一共爬取了%d个,成功了%d个" % (count, succ_count)
        with open("a2.txt", 'w') as fp:
            fp.write(a)




if __name__ == "__main__":

    start_time = time.time()

    ts = [MyThreading() for i in range(total_thread)]
    for t in ts:
        t.start()

    for t in ts:
        t.join()

    end_time = time.time()

    with open("new_urls.txt", 'w') as fp_new, open("old_urls.txt", "w") as fp_old:
        for url in queue.new_urls:
            fp_new.write("%s\n" % url)

        for url in queue.old_urls:
            fp_old.write("%s\n" % url)


    print("end!")
    print("耗时:%d秒" % int(end_time-start_time))



    # u = SpiderMain()
    # u.main(url)





