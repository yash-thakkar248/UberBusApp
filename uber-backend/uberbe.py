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
uber = dict() 
print(uber)
db = mongo_client.test
print('Connect to...')



Database = mongo_client.get_database('uberdb')

User = Database.user
print(Database)
print(User)
################################################
# Tweets 
################################################

# database access layer
def insert_user(r):
    start_time = datetime.now()
    with mongo_client:
        #start_time_db = datetime.now()
        db = mongo_client['uberdb']
        #microseconds_caching_db = (datetime.now() - start_time_db).microseconds
        #print("*** It took " + str(microseconds_caching_db) + " microseconds to cache mongo handle.")

        print("...insert_user() to mongo: ", r)
        try:
            mongo_collection = db['user']
            result = mongo_collection.insert_one(r)
            print("inserted _ids: ", result.inserted_id)
        except Exception as e:
            print(e)

    microseconds_doing_mongo_work = (datetime.now() - start_time).microseconds
    print("*** It took " + str(microseconds_doing_mongo_work) + " microseconds to insert_one.")

def insert_booking(r):
    start_time = datetime.now()
    with mongo_client:
        #start_time_db = datetime.now()
        db = mongo_client['uberdb']
        #microseconds_caching_db = (datetime.now() - start_time_db).microseconds
        #print("*** It took " + str(microseconds_caching_db) + " microseconds to cache mongo handle.")

        print("...insert_booking() to mongo: ", r)
        try:
            mongo_collection = db['bookings']
            result = mongo_collection.insert_one(r)
            print("inserted _ids: ", result.inserted_id)
        except Exception as e:
            print(e)

    microseconds_doing_mongo_work = (datetime.now() - start_time).microseconds
    print("*** It took " + str(microseconds_doing_mongo_work) + " microseconds to insert_one.")

def updateSignIn(r):
    start_time = datetime.now()
    with mongo_client:
        #start_time_db = datetime.now()
        db = mongo_client['uberdb']
        #microseconds_caching_db = (datetime.now() - start_time_db).microseconds
        #print("*** It took " + str(microseconds_caching_db) + " microseconds to cache mongo handle.")

        print("...updateSignIn() to mongo: ", r)
        try:
            mongo_collection = db['user']
            result = mongo_collection.update_one(
                {"username" : r['username']},
                {"$set": r},
                upsert=True)
            print("...update_one() to mongo acknowledged:", result.modified_count)
        except Exception as e:
            print(e)

    microseconds_doing_mongo_work = (datetime.now() - start_time).microseconds
    print("*** It took " + str(microseconds_doing_mongo_work) + " microseconds to update_one.")


# endpoint to logout the user
@app.route("/userLogOut", methods=["POST"])
def sign_user_out():
    username = request.json['username']
    # validate correct user or not
    # check user sign in or not
    checkAlreadySignORNot = checkUserSignIn("username",username)
    print(checkAlreadySignORNot)
    if checkAlreadySignORNot:
        user = dict(username=username,signIn=False)
        print(user)
        updateSignIn(user)
        return jsonify(user)
    else:
        return jsonify('User Already Logged Out')


# endpoint to check user validation
@app.route("/valTest/<username>/<password>", methods=["GET"])
def validateUser(username,password):
    Database = mongo_client.get_database('uberdb')
    User = Database.user
    #query = User.find_one(queryObject,{"username":1}) 
    #query = User.find({"username": { "$in": r['username']}, "password": { "$in": r['password']}}).count()
    query = User.find({"$and":[{"username": username},{"password":password}]}).count()
    print('Query fetched') 
    print(query)
    return query


# endpoint to sign in the user
@app.route("/userSignIn", methods=["POST"])
def sign_user_in():
    username = request.json['username']
    password = request.json['password']
    authenticate = dict(username=username,password=password)
    # validate correct user or not
    print('before calling validation:::')
    userCheck  = validateUser(username,password)
    if userCheck==0:
        return jsonify('Invalid Login');    
    print('Validating User:::')
    print(userCheck)
    # check user sign in or not
    checkAlreadySignORNot = checkUserSignIn("username",username)
    print(checkAlreadySignORNot)
    if not checkAlreadySignORNot:
        user = dict(username=username,signIn=True)
        print(user)
        updateSignIn(user)
        return jsonify(user)
    else:
        return jsonify('User Already Sign In')

# endpoint to create new user
@app.route("/insertUser", methods=["POST"])
def add_user():
    username = request.json['username']
    password = request.json['password']
    emailid = request.json['emailid']
    
    # check uniqueness of user before creation
    userCheck = checkUserPresent("username",username)
    print(userCheck)
    if userCheck==0:
        user = dict(username=username, password=password, emailid=emailid,
                    signIn=False, date=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    _id=str(ObjectId()))
        uber[user['_id']] = user
        print(uber)
        insert_user(user)
        return jsonify('User created successfully')
    else:
        return jsonify('User already Present')



@app.route('/find-one/<argument>/<value>/', methods=['GET']) 
def checkUserSignIn(argument, value):
    Database = mongo_client.get_database('uberdb')
    User = Database.user
    queryObject = {argument: value} 
    query = User.find_one(queryObject,{"signIn":1})
    if query:
        query.pop('_id')
        return query['signIn']
    else:
        return 2



@app.route('/usercheck/<argument>/<value>/', methods=['GET']) 
def checkUserPresent(argument, value):
    Database = mongo_client.get_database('uberdb')
    User = Database.user
    #query = User.find_one(queryObject,{"username":1}) 
    query = User.find({argument: { "$in": [value]}}).count()
    return jsonify(query)



# endpoint to insert new booking
@app.route("/insertBook", methods=["POST"])
def add_booking():
    ticketFrom = request.json['ticketFrom']
    ticketTo = request.json['ticketTo']
    ticketDate = request.json['ticketDate']
    username = request.json['username']
    book = dict(username=username, ticketFrom=ticketFrom, ticketTo=ticketTo, bookeddate=ticketDate,
                creationdate=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                 _id=str(ObjectId()))
    uber[book['_id']] = book
    print(book)
    insert_booking(book)
    return jsonify(book)


# endpoint to search available bookings
@app.route('/search', methods=['POST']) 
def searchResults():
  
    ticketFrom = request.json['ticketFrom']
    ticketTo = request.json['ticketTo']
    dayOfJourney = request.json['ticketDay']
    monthOfJourney = request.json['ticketMonth']
    Database = mongo_client.get_database('uberdb')
    Ride = Database.ride_details
    #query = User.find_one(queryObject,{"username":1}) 
    output=[]
    i=0
    query = Ride.find({ "$and":[{ "day": dayOfJourney},{"month": monthOfJourney}, {"source":ticketFrom}, {"destination":ticketTo}]})

    for x in query: 
        x.pop('_id')
        output.append(x) 
        #output[i].pop('_id') 
        #i += 1
    return jsonify(output)


@app.route('/bookTicket', methods=['POST']) 
def bookTicket():
  
    ticketFrom = request.json['ticketFrom']
    ticketTo = request.json['ticketTo']
    dayOfJourney = request.json['ticketDay']
    monthOfJourney = request.json['ticketMonth']
    Database = mongo_client.get_database('uberdb')
    Ride = Database.ride_details
    #query = User.find_one(queryObject,{"username":1}) 
    output=[]
    i=0
    query = Ride.find({ "$and":[{ "day": dayOfJourney},{"month": monthOfJourney}, {"source":ticketFrom}, {"destination":ticketTo}]})

    for x in query: 
        x.pop('_id')
        output.append(x) 
        #output[i].pop('_id') 
        #i += 1
    return jsonify(output)

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


# endpoint to get tweet detail by id
@app.route("/tweet/<id>", methods=["GET"])
def tweet_detail(id):
    return jsonify(tweets[id])


################################################
# Mock
################################################
@app.route("/")
def home(): 
    return """Welcome to online uber testing ground!<br />
        <br />
        Run the following endpoints:<br />
        From collection:<br/>
        Optionally, to purge database: http://localhost:5000/purge-db"""


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
