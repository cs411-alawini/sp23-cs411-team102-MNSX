## GCP Connection
![GCP_connect](./figures/DB_connection.jpg)

## DDL
CREATE TABLE Users(username varchar(255) primary key, password varchar(255));

CREATE TABLE Games(gameID int primary key, name varchar(255), description text(65535), steamRating int, price int, website varchar(255));

CREATE TABLE Platform(platformName varchar(255) primary key);

CREATE TABLE Genre(genreName varchar(255) primary key);

CREATE TABLE Ratings(username varchar(255), gameID int, rating int, foreign key (username) references Users(username) on delete cascade on update cascade, foreign key (gameID) references Games(gameID) on delete cascade on update cascade);

CREATE TABLE Friends(username varchar(255), friendname varchar(255), foreign key (username) references Users(username) on delete cascade on update cascade, foreign key (friendname) references Users(username) on delete cascade on update cascade);

CREATE TABLE GenreofGame(gameID int, genreName varchar(255), foreign key (gameID) references Games(gameID) on delete cascade on update cascade, foreign key (genreName) references Genre(genreName) on delete cascade on update cascade);

CREATE TABLE PlatformofGame(gameID int, platformName varchar(255), foreign key (gameID) references Games(gameID) on delete cascade on update cascade, foreign key (platformName) references Platform(platformName) on delete cascade on update cascade);

CREATE TABLE SearchHistory(searchID int, username varchar(255), gameID int, primary key (searchID, username), foreign key (username) references Users(username) on delete cascade on update cascade);

## Data Count
![DB_](./figures/Data_count.jpg)

## Advanced Queries
### Query 1:
SELECT genreName, AVG(steamRating) as AvgRating, AVG(price) as AvgPrice, COUNT(gameID) as gameNum
FROM Games NATURAL JOIN GenreofGame
WHERE website <> "None"
GROUP BY genreName
LIMIT 15;

#### Result:
![Query1_result](figures/Query1.jpg)

This query finds the average rating and price, and the total number of games in each genre, and we add the constraint (website <> "None") to ensure that each game record is valid.

### Query 2:


#### Result:


## Indexing Analysis
### Query 1

EXPLAIN ANALYZE SELECT genreName, AVG(steamRating) as AvgRating, AVG(price) as AvgPrice, COUNT(gameID) as gameNum FROM Games NATURAL JOIN GenreofGame WHERE website <> "None" GROUP BY genreName;

#### Only default index (gameID, genereName):
![Query1_index_1](figures/Q1_index_1.jpg)

#### Default index + steamRating_idx:
CREATE INDEX steamRating_idx ON Games(steamRating);
![Query1_index_2](figures/Q1_index_2.jpg)
Since we need to compute the AVG(steamRating), we add an index steamRating_idx. We can find that the actual time for Aggregate using temporary table lower from 97.344..97.347 to 95.771..95.774, the actual time for Nested loop inner join lower from 0.073..65.711 to 0.038..64.881, and the actual time for filter also lower.

#### Default index + steamRating_idx + price_idx:
CREATE INDEX price_idx ON Games(price);
![Query1_index_3](figures/Q1_index_3.jpg)
Since we need to compute the AVG(price), we add an index price_idx. We can find that the actual time for Aggregate using temporary table lower from 95.771..95.774 to 93.982..93.986, and the overall execution time lower from 0.10 sec to 0.09 sec.

#### Default index + steamRating_idx + price_idx + website_idx:
CREATE INDEX website_idx ON Games(website(10));
![Query1_index_4](figures/Q1_index_4.jpg)
Since we need to filter (website <> "None"), we add an index website_idx. We can find that the cost, rows, actual time for Nested loop inner join lower from 16818.70, 33589, 63.479 to 8967.78, 21685, 57.191 because "website" is in the WHERE clause to filter records and we'll have less rows and cost on this step after we add the website_idx. And the actual time for Aggregate using temporary table lower from 93.982..93.986 to 88.071..88.075. In conclusion, adding the above three indexes help improve the overall performance by 0.01 sec.

### Query 2

