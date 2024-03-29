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
SELECT DISTINCT name, description, steamRating, price
FROM PlatformofGame NATURAL JOIN (SELECT * FROM Games NATURAL JOIN GenreofGame WHERE genreName = "Action" AND description <> "" AND steamRating <> 0 AND price < 30) as temp
WHERE platformName = "PlatformWindows" OR platformName = "PlatformMac"
LIMIT 15;

#### Result:
![Query2_result](figures/Query2.jpg)

This query first uses a subquery to find all "Action" games and we add a constraint that the description and rating are not empty, and the price is lower than 30. Then, it finds out the games that are supported by PlatformWindows and PlatformMac.

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
Since we need to filter (website <> "None"), we add an index website_idx. We can find that the cost, rows, actual time for Nested loop inner join lower from 16818.70, 33589, 63.479 to 8967.78, 21685, 57.191 because "website" is in the WHERE clause to filter records and we'll have less rows and cost on this step after we add the website_idx. And the actual time for Aggregate using temporary table lower from 93.982..93.986 to 88.071..88.075. In conclusion, adding the above three indexes help improve the overall performance by 0.01 seconds.

### Query 2

EXPLAIN ANALYZE SELECT DISTINCT name, description, steamRating, price FROM PlatformofGame NATURAL JOIN (SELECT * FROM Games NATURAL JOIN GenreofGame WHERE genreName = "Action" AND description <> "" AND steamRating <> 0 AND price < 30) as temp WHERE platformName = "PlatformWindows" OR platformName = "PlatformMac";

#### Only default index (gameID, genereName, platformName):
![Query2_index_1](figures/Q2_index_1.jpg)

#### Default index + steamRating_idx:
CREATE INDEX steamRating_idx ON Games(steamRating);
![Query2_index_2](figures/Q2_index_2.jpg)
Since we only want to select rows where the steamRating is not equal to 0, we add a steamRating_idx. The cost decreases from 2785.76 to 2072.13. The overall query time remains the same at 0.03 sec. This is because using steamRating to filter decreases the total cost since there are less rows to index (since some are removed).

#### Default index + steamRating_idx + price_idx:
CREATE INDEX price_idx ON Games(price);
![Query2_index_3](figures/Q2_index_3.jpg)
Since we need to compute the AVG(price), we add an index price_idx. The cost increased from 2785.76...2072.13 to 2591.41...2603.07. This may be because the filter didn't remove enough rows to outweigh the extra cost to query the rows again based on price. We can find that the actual time for Aggregate using temporary table lower from 32.946...33.313 to 27.486...27.841, and the overall execution time stays the same for 0.03 sec.

#### Default index + steamRating_idx + price_idx + descrip_idx:
CREATE INDEX descrip_idx ON Games(description(10));
![Query2_index_4](figures/Q2_index_4.jpg)
Since we need to filter (description <> ""), we add an index descrip_idx. The cost, actual time and rows for Temporary table with deduplication lower from 2591.41..2603.07, 27.486..27.841, 735 to 2380.79..2388.37, 22.940..23.324, 408 because "description" is in the WHERE clause to filter records and we'll have less rows and costs on this step after we add descip_idx. And the cost and rows for Nested loop inner join also lower from 2517.90, 735 to 2339.95, 408. In addition, the overall execution time lower from 0.03 sec to 0.02 sec, which indicates that the above three indexes help improve the overall performance.

### Chosen Index Design
We decided to go with the index design that used 4 indexes for both queries (Default index + steamRating_idx + price_idx + website_idx for Query 1 and Default index + steamRating_idx + price_idx + descrip_idx for Query 2). For Query 1, this makes sense since compared to just the normal index, we were able to decrease the overall time the query took by 0.01 seconds and decrease the cost of the nested loop inner join used by 7,850.92 units total. It also makes good sense to do this for Query 2, as using the 4-indexed design lowers the overall query time by 0.01 seconds where the other queries do not. While the costs for this query are not necessarily reduced as drastically as the first, they still are somewhat reduced for some of the more costly operations, and the last 4-indexed design reduces overall time the most regardless, making it the best choice to go with.
