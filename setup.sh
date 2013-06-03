#!/bin/sh
ISERROR=0

which npm > /dev/null 2>&1
if [ $? -ne 0 ] ; then
	echo "command not found: npm"
	echo "please install npm. e.g. sudo port install npm"
	ISERROR=1
fi

which bower > /dev/null 2>&1
if [ $? -ne 0 ] ; then
	echo "command not found: bower"
	echo "please install bower. e.g. npm install -g bower"
	ISERROR=1
fi

which grunt > /dev/null 2>&1
if [ $? -ne 0 ] ; then
	echo "command not found: grunt"
	echo "please install grunt. e.g. npm install -g grunt"
	ISERROR=1
fi

which tsd > /dev/null 2>&1
if [ $? -ne 0 ] ; then
	echo "command not found: tsd"
	echo "please install tsd. e.g. npm install -g tsd"
	ISERROR=1
fi

if [ "${PHANTOMJS_BIN}" = "" ] ; then
	echo "set environment variable PHANTOMJS_BIN"
	echo "please install if you have not installed phantomjs. e.g. sudo port install phantomjs"
	ISERROR=1
fi

if [ $ISERROR == 1 ] ; then
	exit
fi

npm install && \
bower install && \
tsd install jquery && \
echo "OK!"
