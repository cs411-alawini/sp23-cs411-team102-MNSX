## Please list out changes in the directions of your project if the final project is different from your original proposal (based on your stage 1 proposal submission).


The changes we made to our project from what was stated in our original proposal include the user-interface appearance, the similar games search function, Google authentication-based login, and the friend recommendation system. The user-interface mockup originally did not have a space in it to view history or generate a report. This is because the report was included as part of the requirement to include a stored procedure. We weren’t able to create a similar game search and user recommendation function due to time constraints and the ambiguity of implementing these. Instead, we chose to include a creative component by incorporating the Steam Games API and pictures into our application.


## Discuss what you think your application achieved or failed to achieve regarding its usefulness.


Our application achieved its main goal of providing a tool to find new games that align with a user’s tastes. A user can filter through different genres and tags to discover games that fall into the categories of those they want to play. Something it failed to achieve that we had hoped it would is the goal of finding games that are similar to ones a user has already played since we did not implement that functionality. 


## Discuss if you changed the schema or source of the data for your application


We did not change our database schema or the source of data for our application. We only added one additional source to create user data, and we did so by randomly generating 1000 names and passwords. 


## Discuss what you changed to your ER diagram and/or your table implementations. What are some differences between the original design and the final design? Why? What do you think is a more suitable design? 


We did not make any changes to our ER diagram or to our table implementations. The original design we made was suitable enough to not require any changes as we moved forward with the project. 


One functionality we added is the history report. The history report was added as a stored procedure to complement the searching functionality of our application and provide a user with some data on their own searches and therefore on their personal game preferences, which is useful for discovering new games which align with those preferences. 


Our UI looks significantly different from the one we made in the mock-up design for the purpose of streamlining the application and adding the friend list. We did not implement the similar games search function or the friend recommendation system due to not being able to come up with the right algorithm to accurately recommend similar friends/games. We also did not implement the Google authentication login as our TA told us it was overly complicated and that it would be a better idea to make user login simpler. 


## Explain how you think your advanced database programs complement your application.


Because our application is user-separated, we went with a stored procedure instead of a transaction. Since every user has their own instance of the table, it doesn't make sense to use a transaction. This makes our application suitable for a stored procedure.


Our advanced database programs complement our application because the user is able to get a summary of all the history they have had throughout their time as a user of this application. Furthermore, the stored procedure produced a clear set of rows to display to the user when the report was generated.


## Each team member should describe one technical challenge that the team encountered.  This should be sufficiently detailed such that another future team could use this as helpful advice if they were to start a similar project or where to maintain your project. 


Some technical challenges we encountered during the development of this project include connecting to the database, linking the database to the application, logging into the application, running nodeJS, and we also had some cursor issues with our stored procedure.

Siya:
A technical challenge that we encountered was connecting to the SQL workbench, which was hosted by one member (Minghua) through GCP and the GCP credits provided by the class. However, while everyone else was unable to connect to it, I was unable to connect to it, even though the global IP address, 0.0.0.0, was enabled. Eventually, we got together on Illinois WiFi after class and I was able to connect with the new IP address generated from being on that WiFi (e.g. search on Google “what’s my IP?”)

Minghua: 
When connecting the front end to the back end, we met the CORS problem. CORS stands for Cross-Origin Resource Sharing. It is a security feature implemented in web browsers that restricts web pages from making requests to a different domain than the one the page originated from. In other words, if a web page loaded from one domain tries to make a request to a resource on a different domain, the browser will typically block the request. To enable these legitimate cross-origin requests, websites can use CORS to explicitly allow cross-origin requests from specific domains. This is done by setting HTTP headers in the response to the cross-origin request, which tells the browser that the requested resource is safe to load. The most common header used for this purpose is the Access-Control-Allow-Origin header. We can write this in the back end:
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
app.use(cors({origin: "http://localhost:3000"}));

Xiaofan:
After successfully running the back end and front end on ports, I was unable to log into the application with a username and password already established in the database. After a lot of trial and error thinking it was an issue with the procedures, it turns out that the problem was with CORS since it was set to localhost:3000, but my port was not running since I already had other applications running on that port. I just had to change localhost:3000 to localhost:3001, and I was able to log in. 

Nisha: 
We were unable to get nodeJS to install and run correctly on my computer, despite trying to install it via both npm and web download. As a result, any work I did on the front end of the application had to be tested by another member of the team. We were unable to find a fix for this as it was late in the semester and project development, but one potential way to have solved the issue would have been to set up a virtual machine as a development environment to ensure the program essentials would run on everyone’s computers. 


## Are there other things that changed comparing the final application with the original proposal?


The final intent of our app has not changed, but small components in the app as outlined in "Discuss what functionalities you added or removed" have. These are small changes that we made to enhance user experience and also increase product feasibility within the given timeline. 


## Describe future work that you think, other than the interface, that the application can improve on


Some future improvements to the application would be to actually implement the functionality to search for games that are similar to an inputted one and the functionality to find other users with the same genre preferences. Another improvement would be adding friend requests that have to be accepted and not just immediately adding the searched user as a friend, and the ability to chat between two users. 


## Describe the final division of labor and how well you managed teamwork


Our final division of labor was about as described in the project proposal, plus a few extra things that we added to our project: 

Minghua: Integrate user register, login, logout, aid in building the infrastructure of front-end/flush out details, stored procedure + trigger. History, friend list. Created front end. 

Nisha: Create a table to store the history for each user, find a way to host the back end, and help with the front end as needed. Friendlist. Database design, writeups. 

Siya: Queries to find games based on filters, outputting links for suggested games, adding suggested games to the history database table built by Nisha, help with the front end as needed. Login, logout, search functionality, adv query. 

Xiaofan: Building out the infrastructure of the front-end/continue to develop the web app, host the website on GCP, and find similarities between users and display users. Friendlist. 

We managed our teamwork fairly well and tried to make sure we got everything done before our deadlines hit. We communicated regularly through Discord and also met up to discuss our project and the direction it was going in. Overall, we finished everything to a good standard and on time, so it worked out for us. 
