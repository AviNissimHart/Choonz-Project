package com.qa.choonz.rest.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qa.choonz.persistence.domain.Playlist;
import com.qa.choonz.rest.dto.PlaylistDTO;
import com.qa.choonz.service.PlaylistService;
import com.qa.choonz.utils.AuthUtils;

@RestController
@RequestMapping("/playlists")
@CrossOrigin
public class PlaylistController {

    private PlaylistService service;

    public PlaylistController(PlaylistService service) {
        super();
        this.service = service;
    }

    @PostMapping("/create")
    public ResponseEntity<PlaylistDTO> create(@RequestBody Playlist playlist, @RequestHeader("token") String token) {
        if (AuthUtils.validToken(token) && AuthUtils.getTokenOwner(token) == playlist.getUser().getId()) {
        	return new ResponseEntity<>(this.service.create(playlist), HttpStatus.CREATED);
        } else {
        	return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/read")
    public ResponseEntity<List<PlaylistDTO>> read() {
        return new ResponseEntity<>(this.service.read(), HttpStatus.OK);
    }

    @GetMapping("/read/{id}")
    public ResponseEntity<PlaylistDTO> read(@PathVariable long id) {
        return new ResponseEntity<>(this.service.read(id), HttpStatus.OK);
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<PlaylistDTO> update(@RequestBody Playlist playlist, @PathVariable long id, @RequestHeader("token") String token) {
        if (AuthUtils.validToken(token) && AuthUtils.getTokenOwner(token) == playlist.getUser().getId()) {
        	return new ResponseEntity<>(this.service.update(playlist, id), HttpStatus.ACCEPTED);
        } else {
        	return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<PlaylistDTO> delete(@RequestHeader("uid") String userId, @PathVariable long id, @RequestHeader("token") String token) {
    	if (AuthUtils.validToken(token) && this.service.read(id).getUser().getId() == Long.parseLong(userId)) {
    	return this.service.delete(id) ? new ResponseEntity<PlaylistDTO>(HttpStatus.NO_CONTENT)
                : new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
        	return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
    
    @PostMapping("/add/{playlistId}/{trackId}")
    public ResponseEntity<PlaylistDTO> add(@RequestHeader("uid") String userId, @PathVariable long trackId, @PathVariable long playlistId, @RequestHeader("token") String token){
        if (AuthUtils.validToken(token) && this.service.read(playlistId).getUser().getId() == Long.parseLong(userId)) {
        	return new ResponseEntity<>(this.service.addTrack(playlistId, trackId), HttpStatus.ACCEPTED);
        } else {
        	return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    	
    }
    
    @PostMapping("/remove/{playlistId}/{trackId}")
    public ResponseEntity<PlaylistDTO> remove(@RequestHeader("uid") String userId, @PathVariable long playlistId, @PathVariable long trackId, @RequestHeader("token") String token){
        if (AuthUtils.validToken(token) && this.service.read(playlistId).getUser().getId() == Long.parseLong(userId)) {
        	return new ResponseEntity<>(this.service.removeTrack(playlistId, trackId), HttpStatus.ACCEPTED);
        } else {
        	return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

}
