#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests, re
from bs4 import BeautifulSoup
from urllib.parse import urljoin

'''

@ 定义类:
    UrlHandler : url 管理器
    DownloaderHandler: html 下载器
    ParserHandler: Dom解析器
    OutputerHandler: 结果输出器



'''


'''
    @ url管理器
    add_new_url: 添加新的url进入管理器
    add_new_urls: 添加多个url进管理器
    get_new_url: 获取新url
    has_get_url: 判断是否有新的url

    new_urls: 还没有被爬取的url
    old_urls: 已经被爬取的url
'''
class UrlHandler(object):

    def __init__(self):
        self.new_urls = set()
        self.old_urls = set()
        self.pattern_people = re.compile(r'\/people')

    def add_new_url(self, url):
        if url is None:
            return ''
        if url in self.new_urls or url in self.old_urls:
            return ''
        self.new_urls.add(url)

    def add_new_url_spical(self, url):
        self.old_urls.remove(url)
        self.new_urls.add(url)

    def add_new_urls(self, urls):
        if urls is None or len(urls) == 0:
            return ''
        for url in urls:
            self.add_new_url(url)

    def has_get_url(self):
        return len(self.new_urls) > 0

    def get_new_url(self):
        if len(self.new_urls) > 0:
            url = self.new_urls.pop()
            self.old_urls.add(url)
            return url
        else:
            return ''

    def is_vaild_url(self,url):
        if self.pattern_people.findall(url):
            return url


'''
    @ url下载器
    downloader_url: 下载页面内容
'''
class DownloaderHandler(object):

    def __init__(self):
        self.headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate, sdch, br",
            "Accept-Language": "zh-CN,zh;q=0.8,en;q=0.6",
            "Cache - Control": "no-cache",
            "Connection": "keep-alive",
            "Cookie": 'd_c0="AHBADsa7HAqPTnAeAubZHVnZ88ABsEvnuPM=|1466506963"; _za=8a4cf700-7352-433b-9d9a-f547ef8c1da0; _zap=f37b3053-a9a6-4024-9d0d-280e5ee4c6f2; q_c1=f4dba8257f2e46079cc7d7ec75d2f4ec|1469448045000|1466506963000; _ga=GA1.2.2143895386.1469448048; _xsrf=86a448efc8f340937250df68b7703977; l_cap_id="ZmNhMWZiZThjMDdjNDkxOTgwMmI4MWU1ZmM0MWU2NzE=|1471022845|6c931d4081dd7d303e3e6336341f1cbd4bd20513"; cap_id="YzM5YzM5ZmJmZjBlNDExOThmMjBiZjk5YmY1MWMyODI=|1471022845|08e08fb5afb29fcec7924f3d6b2d98f1da020785"; login="ODNlOGJiNjdmNDUxNDNmODk0ZDliOGUxNWQyMjE4OGE=|1471022850|8266490d5d1ee5a9dfb8cabd57d93286f2c1879d"; n_c=1; __utma=51854390.2143895386.1469448048.1471023383.1471023383.1; __utmc=51854390; __utmz=51854390.1471023383.1.1.utmcsr=zhihu.com|utmccn=(referral)|utmcmd=referral|utmcct=/people/sunlau; __utmv=51854390.100--|2=registration_date=20151015=1^3=entry_date=20151015=1; a_t="2.0ABAMRKLv2ggXAAAA6pnVVwAQDESi79oIAHBADsa7HAoXAAAAYQJVTQKU1VcACkl4AtnTn20pf4RiNrgWypzdAsZp3pzCFhIJMJzfeNfD2G4yzuQXNg=="; z_c0=Mi4wQUJBTVJLTHYyZ2dBY0VBT3hyc2NDaGNBQUFCaEFsVk5BcFRWVndBS1NYZ0MyZE9mYlNsX2hHSTJ1QmJLbk4wQ3hn|1471024362|d5f43df0985307bf88f143290ad4e79eca8e6a9f',
            "Host": "www.zhihu.com",
            "Origin": "http://evil.com/",
            "Pragma": "no-cache",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36",

        }

    def downloader_url(self, url):
        res = requests.get(url, headers=self.headers)
        res.encoding = "utf-8"
        if res.status_code == 200:
            return res.text
        else:
            print("%s页面爬取失败,失败状态%d" % (url,res.status_code))


'''
    @ parser Dom/html解析器
    parser_html: 解析html内容

    _filter_url: 过滤出url
    _filter_keys: 过滤出关键字
    会过滤出两组 url:
        一组用来继续深度爬取
        一组则是用户数据
    抓取用户信息: 职业,位置,关注人数,被关注人数
'''
class ParserHandler(object):

    def __init__(self):
        self.pattern = re.compile("author-link|question_link")
        self.pattern_people = re.compile('\/people')
        self.pattern_sex = re.compile('icon icon-profile-male|icon icon-profile-female')

    def parser_html(self, docs, url):
        if docs is None or url is None:
            return ''
        soup = BeautifulSoup(docs, "html.parser")
        urls = self._filter_url(soup, url)
        data = self._filter_keys(soup, url)
        return urls, data

    def _filter_url(self, soup, url):

        node_doms = soup.find_all("a", class_=self.pattern)
        urls = set()
        for node in node_doms:
            new_url = urljoin(url, node['href'])
            urls.add(new_url)
        return urls

    def _filter_keys(self, soup, url):
        if self.pattern_people.findall(url):

            name = soup.find("div",class_="title-section").find("span")
            job = soup.find("span", class_="education-extra item")
            location = soup.find("span", class_='location item').find('a')
            follow, bfollow = soup.find("div", class_="zm-profile-side-following zg-clear").find_all("strong")
            sex = soup.find('i', class_=self.pattern_sex)

            job = self._numice_v(job)
            location = self._numice_v(location)
            sex = self._numice_v(sex, 'class')

            return {"name":name.text, "job": job, "location": location, "follow": follow.text, "bfollow": bfollow.text, "sex": sex}
        else:
            return ''

    def _numice_v(self, obj, key="title"):
        if obj:
            return obj[key]
        else:
            return "-"

'''
    @ OutputerHandler: 内容输出器

'''
class OutputHandler(object):

    def __init__(self):
        self.list = []
        self.err_list = []

    def add_data(self,data):
        if data is None:
            return ''
        self.list.append(data)

    def out_text(self):
        with open("zhihu_info.txt","w") as fp:
            for line in self.list:
                obj = {
                    "name": line["name"].encode("utf-8"),
                    "job": line['job'].encode("utf-8"),
                    "location": line['location'].encode("utf-8"),
                    "follow": line['follow'].encode("utf-8"),
                    "bfollow": line['bfollow'].encode("utf-8"),
                }
                fp.write("用户名:{0},职业:{1},地址:{2},关注人数:{3},被关注人数:{4}.\n".format(obj['name'],obj['job'],obj['location'],obj['follow'],obj['bfollow']))
        with open("zhihu_error.txt","w") as fp:
            for line in self.err_list:
                fp.write("失败url:%s,错误报错:%s\n" % (line['url'].encode("utf-8"),line['error_info']))

        print("end")

    def out_text2(self):
        with open("a3.txt", "a") as fp:
            for line in self.list:
                obj = {
                    "name": line["name"],
                    "job": line['job'],
                    "location": line['location'],
                    "follow": line['follow'],
                    "bfollow": line['bfollow'],
                    "sex": line['sex']
                }
                fp.write("用户名:{0},性别:{5},职业:{1},地址:{2},关注人数:{3},被关注人数:{4}.\n".format(obj['name'], obj['job'], obj['location'],
                                                                              obj['follow'], obj['bfollow'], obj["sex"]))
        with open("zhihu_error.txt", "w") as fp:
            for line in self.err_list:
                fp.write("失败url:%s,错误报错:%s\n" % (line['url'].encode("utf-8"), line['error_info']))

        print("end")
