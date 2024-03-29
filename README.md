# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Christopher Williams | 300174 |
| Stefan Popescu | 299558 |
| Anne-Marie Rusu | 296098 |
| Simon Gmür | 303207 |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (29th March, 5pm)


### Dataset

https://www.kaggle.com/datasets/julianoorlandi/spotify-top-songs-and-audio-features/data

Our dataset contains the songs from the top 200 charts on Spotify for each year since 2016, their respective artists and number of streams, as well as the audio features of each song. The dataset is updated regularly (with new charts data), and the latest update at the time of writting this was carried out on March 10th.

The data is complete and requires very little preprocessing or cleaning, and can be worked with directly for the most part. A closer look at the dataset and an explanation is carried out in the "EDA" interactive notebook found in the ```Milestone 1``` folder.

As of March 10th 2024, there are currently 6513 entries in the dataset, each entry represents a track, with its associated artists, Spotify statistics such as number of streams, the number of weeks on the top charts, and then a few very interesting descrpitive and musical features such as "key", "energy", "danceability", time signature and many others which are further explored in the Python notebook. 

### Problematic

The aim of our visualization is to present the various characteristics of a selected song in a fun and appealing way (i.e. a crowd dancing faster or slower based on the song tempo). Simultaneously, the values of these characteristics will be represented as bar graphs, imitating the look of a sound wave with each bar representing a different characteristic. A DJ table placed at the bottom of the page allows for filtering desired characteristics, as well as playing a snippet of the song. More concretely, the DJ table consists of multiple interactable buttons and sliders corresponding to the different song features (key, tempo, duration, ...), which allows the user to find songs based on specific combinations of desired criteria. 

In a similar fashion, a toggle between songs and artists allows artists’ average song characteristics to be filtered and presented. This enables the user to find artists who produce a certain style of music, once again using the DJ table as a controller. Naturally, should the user not wish to use the filters, it is possible to search for songs and artists directly through a search bar at the top of the page.

Overall, we aim to provide a novel and intuitive tool for analyzing songs and artists, as well as for discovering new songs. All of that wrapped in a single easy to use, fun and visually appealing frame.

The current target audience ranges from teenagers to young adults who would like to discover more about their favorite songs (as they were the target demographic of music released since 2016), but also could include professional DJs or movie directors looking for songs that fit into very specific criteria.

We want to provide a practical visualization of song features that, even if tracked, are not often presented when using an app such as Spotify. However for those curious, we believe that the data should be available, and in our case aim to provide full control over searching based on these criteria. Instead of relying on genres, stereotypes, albums and specific playlists, we explore a completely different approach to presenting songs and artists. As a result, we hope to come across unexpected discoveries, and create a visualization that could be generalized to a dataset beyond only the Top 200 charts.

Here is a visual prototype sketch that will hopefully aid in understanding the goal of the project: ![picture could not load](Milestone%201/prototype "Our prototype. Credits: Annie")


### Exploratory Data Analysis

The EDA was performed in a python interactive notebook, which can be found [here](Milestone%201/EDA.ipynb).



### Related work


> - What others have already done with the data?
> - Why is your approach original?
> - What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).
> - In case you are using a dataset that you have already explored in another context (ML or ADA course, semester project...), you are required to share the report of that work to outline the differences with the submission for this class.

