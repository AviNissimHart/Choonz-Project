const findId = new URLSearchParams(window.location.search);
for (let found of findId) {
    let id = found[1];
    console.log(id);
    getID(id);  
 } 

function getID(id) {
 fetch('http://localhost:8082/genres/read/'+id)
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
        console.log(data);
        populate(data);
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
}

function populate(data) {
    console.log(data['name']);
    console.log(data['id']);
    let find = document.getElementById("main_info");
    let image = document.createElement("img");
    image.src = data['picture'];
    image.id = "image_genre";
    find.appendChild(image);

    let textContainer = document.createElement("div");
    textContainer.className ="container";
    textContainer.id = "text_container";
    find.appendChild(textContainer);

    let genreName = document.createElement("h1");
    genreName.style = "font-size: 45px;";
    genreName.textContent = data["name"];


    let descGenre = document.createElement("div");
    let genre = document.createElement("p");
    genre.style = "font-size: 17px;";
    genre.textContent = data["description"];
    descGenre.appendChild(genre);

    let linkInfo = document.createElement("a");
    linkInfo.href="#";
    linkInfo.setAttribute("data-toggle", "modal");
    linkInfo.setAttribute("data-target", "#exampleModal");
    let info = document.createElement("i");
    info.className = "far fa-edit";
    linkInfo.appendChild(info);

    textContainer.appendChild(genreName);
    textContainer.appendChild(descGenre);
    textContainer.appendChild(linkInfo);

    let tableContainer = document.createElement("div");
    tableContainer.id = "table_container";
    let table = document.createElement("table");
    table.className = "table table-hover";
    let tableBody = document.createElement("tbody");
    find.appendChild(tableContainer);
    tableContainer.appendChild(table);
    table.appendChild(tableBody);
    console.log(data["tracks"]);
    let songCount = 1;
    // Populate the table
    for (let key in data['tracks']) { 
    console.log(data["tracks"][key]["id"]);
     let value = data['tracks'][key]["name"];
     console.log(value);
     let row = document.createElement("tr");
     tableBody.appendChild(row);

     let songId = document.createElement("th");
     songId.scope = "row";
     songId.textContent = songCount;
     row.appendChild(songId);

     let songName = document.createElement("td");
     let link = document.createElement("a");
     link.href = "#";
     link.textContent = value;
     row.appendChild(songName);
     songName.appendChild(link);
      
     let songIcon = document.createElement("td");
     let dropdownMenu = document.createElement("div");
     dropdownMenu.className="dropdown";
     songIcon.appendChild(dropdownMenu);
      
    let linkSong = document.createElement("a");
      linkSong.href ="#";
      linkSong.id ="dropdownMenu2";
      linkSong.setAttribute("data-toggle", "dropdown");
      linkSong.setAttribute("aria-haspopup", "true");
      linkSong.setAttribute("aria-expanded", "false");
      let infoSong = document.createElement("i");
      infoSong.className ="fas fa-ellipsis-h";
      infoSong.id = "info_tracks"
      row.appendChild(songIcon);
      linkSong.appendChild(infoSong);
      dropdownMenu.appendChild(linkSong);

      let dropdown = document.createElement("div");
      dropdown.className = "dropdown-menu";
      dropdownMenu.appendChild(dropdown);

      let linkDelete = document.createElement("a");
      linkDelete.href='#';
      linkDelete.className = "dropdown-item";
      linkDelete.setAttribute("onClick", "window.location.reload();");
      linkDelete.addEventListener("click", function(stop){
        stop.preventDefault();  
        deleteTrack((data["tracks"][key]["id"]));    
      })
      linkDelete.textContent = "Delete";
      dropdown.appendChild(linkDelete);
      let spanDelete = document.createElement("span");
      spanDelete.id ="album-menu-delete";
      linkDelete.appendChild(spanDelete);
      let iconDelete = document.createElement("i");
      iconDelete.className = "far fa-trash-alt";
      spanDelete.appendChild(iconDelete);

      let linkPlaylist = document.createElement("a");
      linkPlaylist.href="#";
      linkPlaylist.className = "dropdown-item";
      linkPlaylist.textContent = "Add to Playlist";
      dropdown.appendChild(linkPlaylist);

      let spanPlaylist = document.createElement("span");
      spanPlaylist.id ="album-menu-playlist";
      linkPlaylist.appendChild(spanPlaylist);

      let iconPlaylist = document.createElement("i");
      iconPlaylist.className = "fas fa-music";
      spanPlaylist.appendChild(iconPlaylist);

     songCount++;
    }

    let findDelete = document.getElementById("modal-footer");
    let deleteButton = document.createElement("a");
    //deleteButton.href="albums.html";
    deleteButton.className="btn btn-danger";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("onClick", "location.href = 'genres.html';");
    deleteButton.addEventListener("click", function(stop){
      stop.preventDefault(); 
      deleteAlbum(data['id']);    
    })
    findDelete.appendChild(deleteButton);
}

function deleteTrack(id) {
  fetch('http://localhost:8082/tracks/delete/' + id, {
  method: 'DELETE',
  })
  .then(res => res.text()) // or res.json()
  .then(res => console.log(res))

}

function deleteAlbum(id) {
  fetch('http://localhost:8082/genres/delete/' + id, {
  method: 'DELETE',
  })
  .then(res => res.text()) // or res.json()
  .then(res => console.log(res))

}