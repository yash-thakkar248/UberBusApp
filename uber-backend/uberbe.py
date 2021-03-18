from flask import Flask, flash, request, jsonify, render_template, redirect, url_for, g, session, send_from_directory, abort
from flask_cors import CORS
from flask_api import status
from datetime import date, datetime, timedelta
from calendar import monthrange
from dateutil.parser import parse
import pytz
import os
import sys
import time
import uuid
import json
import random
import string
import pathlib
import io
from uuid import UUID
from bson.objectid import ObjectId

# straight mongo access
from pymongo import MongoClient

# mongo
#mongo_client = MongoClient('mongodb://localhost:27017/')
#mongo_client = MongoClient("mongodb+srv://admin:admin@tweets.8ugzv.mongodb.net/tweets?retryWrites=true&w=majority")

mongo_client = MongoClient("mongodb+srv://parth:4mF294RcpqMutJk7@cluster0.esm5u.mongodb.net/uberdb?retryWrites=true&w=majority")

app = Flask(__name__)
CORS(app)
basedir = os.path.abspath(os.path.dirname(__file__))

# Here are my datasets
tweets = dict()      
print(tweets)
db = mongo_client.test
print('Connect to...')



Database = mongo_client.get_database('uberdb')

User = Database.user
print(Database)
print(User)
################################################
# Tweets 
################################################


@app.route('/all', methods=['GET']) 
def findAll(): 
    query = User.find() 
    output = {} 
    i = 0
    for x in query: 
        output[i] = x 
        output[i].pop('_id') 
        i += 1
    return jsonify(output)

# endpoint to create new tweet
@app.route("/tweet", methods=["POST"])
def add_tweet():
    user = request.json['user']
    description = request.json['description']
    private = request.json['private']
    pic = request.json['pic']
    tweet = dict(user=user, description=description, private=private,
                upvote=0, date=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                pic=pic, _id=str(ObjectId()))
    tweets[tweet['_id']] = tweet

    insert_one(tweet)
    return jsonify(tweet)

# endpoint to show all of today's tweets
@app.route("/tweets-day2", methods=["GET"])
def get_tweets_day2():
    todaystweets = dict(
        filter(lambda elem: 
                elem[1]['date'].split(' ')[0] == datetime.now().strftime("%Y-%m-%d"), 
                tweets.items())
    )
    return jsonify(todaystweets)

# endpoint to show all tweets 
@app.route("/tweets", methods=["GET"])
def get_tweets2():
    return jsonify(tweets)


@app.route("/tweets-results", methods=["GET"])
def get_tweets_results():
    return json.dumps({"results":
        sorted(
            tweets.values(),
            key = lambda t: t['date']
        )
    })


@app.route("/bookresults", methods=["GET"])
def get_book_results():
    return json.dumps({"results":
        sorted(
            tweets.values(),
        )
    })



# endpoint to show all of today's tweets (user-specific)
def filter_tweet(t):
    tweet = tweets[t]
    return dict(date=tweet['date'], description=tweet['description'], 
                private=tweet['private'], user=tweet['user'],
                upvote=tweet['upvote'] if 'upvote' in tweet else 0,
                pic=tweet['pic'])
@app.route("/tweets-user-day", methods=["POST"])
def get_tweets_user_day():
    user = request.json['user']
    todaystweets = dict(
        filter(lambda elem: 
                elem[1]['date'].split(' ')[0] == datetime.now().strftime("%Y-%m-%d") and
                (
                    False == elem[1]['private'] or
                    user == elem[1]['user']
                ), 
                tweets.items())
    )
    #return jsonify(todaystweets)
    return jsonify(
        sorted(
            [filter_tweet(k) for k in todaystweets.keys()],
            key = lambda t: t['date']
        )
    )

# endpoint to show all of this week's tweets (user-specific)
@app.route("/tweets-user-week", methods=["POST"])
def get_tweets_user_week():
    user = request.json['user']
    weekstweets = dict(
        filter(lambda elem: 
                (datetime.now() - datetime.strptime(elem[1]['date'].split(' ')[0], '%Y-%m-%d')).days < 7 and
                (
                    False == elem[1]['private'] or
                    user == elem[1]['user']
                ), 
                tweets.items())
    )
    #return jsonify(weekstweets)
    return jsonify(
        sorted(
            [filter_tweet(k) for k in weekstweets.keys()],
            key = lambda t: t['date']
        )
    )


@app.route("/tweets-user-week-results", methods=["GET"])
def get_tweets_user_week_results():
    user = request.json['user']
    weektweets = dict(
        filter(lambda elem: 
                (datetime.now() - datetime.strptime(elem[1]['date'].split(' ')[0], '%Y-%m-%d')).days < 7 and
                (
                    False == elem[1]['private'] or
                    user == elem[1]['user']
                ), 
                tweets.items())
    )
    #return jsonify(todaystweets)
    return json.dumps({"results":
        sorted(
            [filter_tweet(k) for k in weektweets.keys()],
            key = lambda t: t['date']
        )
    })


# endpoint to get tweet detail by id
@app.route("/tweet/<id>", methods=["GET"])
def tweet_detail(id):
    return jsonify(tweets[id])


################################################
# Mock
################################################
@app.route("/")
def home(): 
    return """Welcome to online mongo/twitter testing ground!<br />
        <br />
        Run the following endpoints:<br />
        From collection:<br/>
        http://localhost:5000/tweets<br />
        http://localhost:5000/tweets-week<br />
        http://localhost:5000/tweets-week-results<br />
        Create new data:<br />
        http://localhost:5000/mock-tweets<br />
        Optionally, to purge database: http://localhost:5000/purge-db"""


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')