SELECT songs.song_name, artists.artist_name FROM songs,artists,song_artist WHERE songs.id = song_artist.song_id AND artists.id = song_artist.artist_id;
