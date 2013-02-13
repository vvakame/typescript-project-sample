#!/bin/sh

which npm > /dev/null 2>&1
if [ $? -ne 0 ] ; then
	echo "command not found: npm"
	echo "please install npm. e.g. sudo port install npm"
fi

which bower > /dev/null 2>&1
if [ $? -ne 0 ] ; then
	echo "command not found: bower"
	echo "please install bower. e.g. npm install -g bower"
fi

which tsd > /dev/null 2>&1
if [ $? -ne 0 ] ; then
	echo "command not found: tsd"
	echo "please install tsd. e.g. npm install -g tsd"
fi

which testacular > /dev/null 2>&1
if [ $? -ne 0 ] ; then
	echo "command not found: testacular"
	echo "please install testacular. e.g. npm install -g testacular"
fi

if [ "${PHANTOMJS_BIN}" = "" ] ; then
	echo "set environment variable PHANTOMJS_BIN"
	echo "please install if you have not installed phantomjs. e.g. sudo port install phantomjs"
fi

npm install && \
bower install && \
tsd install jquery && \
echo "OK!"
