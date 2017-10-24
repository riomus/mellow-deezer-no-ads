//-----------------------------------------------------------------------------
//
// This file is part of MellowPlayer.
//
// MellowPlayer is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// MellowPlayer is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with MellowPlayer.  If not, see <http://www.gnu.org/licenses/>.
//
//-----------------------------------------------------------------------------
function update() {
    var playbackStatus = mellowplayer.PlaybackStatus.STOPPED;
    if (dzPlayer.isPlaying())
        playbackStatus = mellowplayer.PlaybackStatus.PLAYING;
    else if (dzPlayer.isPaused())
        playbackStatus = mellowplayer.PlaybackStatus.PAUSED;
    else if (dzPlayer.isLoading())
        playbackStatus = mellowplayer.PlaybackStatus.BUFFERING;

    return {
        "playbackStatus": playbackStatus,
        "canSeek": dzPlayer.control.canSeek(),
        "canGoNext": dzPlayer.getNextSong() !== null,
        "canGoPrevious": dzPlayer.getPrevSong() !== null,
        "canAddToFavorites": true,
        "volume": dzPlayer.volume,
        "position": dzPlayer.getPosition(),
        "duration": dzPlayer.getDuration(),
        "isFavorite": isFavorite(),
        "songId": dzPlayer.getSongId(),
        "songTitle": dzPlayer.getSongTitle(),
        "artistName": dzPlayer.getArtistName(),
        "albumTitle": dzPlayer.getAlbumTitle(),
        "artUrl": 'http://e-cdn-images.deezer.com/images/cover/' + dzPlayer.getCover() + '/250x250.jpg'
    }
}

function isFavorite() {
    try {
        return $("#player-cover > div.player-actions.clearfix > span:nth-child(2) > button")[0].className.indexOf("is-favorite") !== -1;
    }
    catch (e) {
        return false;
    }
}

function play() {
    dzPlayer.control.play();
}

function pause() {
    dzPlayer.control.pause();
}

function goNext() {
    dzPlayer.control.nextSong();
}

function goPrevious() {
    dzPlayer.control.prevSong();
}

function setVolume(volume) {
    dzPlayer.control.setVolume(volume);
}

function addToFavorites() {
    $(".icon-love").click()
}

function removeFromFavorites() {
    $(".icon-love").click()
}

function seekToPosition(position) {
    // (0 = beginning, 1 = end)
    var normalizedPos = position / dzPlayer.getDuration();
    dzPlayer.control.seek(normalizedPos)
}


(function(core, win, doc, _, toWin){
    GM_VALUES={}
    'use strict';
    // 'Permission denied to access object'
    toWin = function(f){return (core.cloneInto || function (e){return e;})(f, win, {cloneFunctions: true});};

    // ECB token / license boost for SWF and HTML5
    _.TokenECBBoost = function (s){
       return s.replace(/^(7a6b2fe07a585a779b09014bf2df820e504d06632656d5208ea5e7d2064962a4a6e85c885d91eaadcebe68565a89f2b775e63ab8c9cf17dffcbd50b8562592b68b48512c09f96a80fe4379a0e6ad0b6e[0-9a-f]{64})1ce7aa51594079443963742456a61e1cb91f5d802b1c57925f3d5b4550d409beb638feccc360c3653ff5e4fba63dd340c2f68792f9b18c274830246101dca63a0916828e1307ba3db2b49ab9b12017b4fc6428eeaae3f402d78259e53edbfd82d76ab5c3f9490c22faa589996e404a622d4d070b350d38048a59891450219ed82a689a047237588b91023f5e5cea32bc4abeeb561455d5caf9b0186353cd8b51474acd689f439a6991fd8acbd1e93ad1cc0cdc5a17dd2342ef39bd7cb37f0cb107d2ef55a55f02913b32cc2d180833495e3449261499e3b80ac1571dee055fc1$/i,
                 '$16237a96a30afb2ea143511d6956151495c1fa863e7b6ca5cfae2e45187ba2f27c2f68792f9b18c274830246101dca63abe2ea3e573f203cfc95ca54b7fec98b3843ea1db72386ee9009b3bfc528761f37a83078239291fa7428c150ad2e5e991e5a9ffc8f181c8793ab416125cb4213db284d032a99163b4932d98b6d512211a8eb77f4c513b588dddf7bfc6e6e00390b01b07dba6513ddb45ec17699c99342608ae3b4a69d9a0bfecca7a0c2cf9300b7e24db6d2c48c70198d7741de3a8946818586917fc62770c7f283c5f1920754947cc2e943b75d91bc4d229e2513fb7f3');
    };

    // SYNC
    _.getTime = win.Date.prototype.getTime;
    _.func = function(){
        // REGULAR VERSION
        if (win.USER && win.USER.USER_ID){
            if ([789152775].indexOf(win.USER.USER_ID) !== -1){
                core = win = doc = {};
            }
            win.USER.OPTIONS.ads_audio = false;
            win.USER.OPTIONS.ads_display = false;
            win.USER.OPTIONS.can_subscribe = false;
            win.USER.OPTIONS.web_hq = (win.PLAYER_TOKEN !== _.TokenECBBoost(win.PLAYER_TOKEN));
            win.DZPS = true;
            win.PLAYER_TOKEN = _.TokenECBBoost(win.PLAYER_TOKEN);

            // Promo Popup
            win.WebSocket.prototype.send = toWin(function(){});
            localStorage.setItem('ab.storage.lastInAppMessageRefresh.5ba97124-1b79-4acc-86b7-9547bc58cb18','{"v":2147483647000}');
            win.Date.prototype.getTime = _.getTime;
        }
    };

    // ASYNC FAST
    _.tFast = setInterval(function(){
        // Rights
        if (win.right){
            _.checkSongAvailable = win.right.checkSongAvailable;
            win.right.checkSongAvailable = toWin(function(d){
                if (GM_VALUES[d.SNG_ID]){
                    return  _.checkSongAvailable(d);
                }
                return win.right.READABLE;
            });

            clearInterval(_.tFast);
        }
    }, 25);

    // adds track to banlist
    _.Song403Skip = function(){
        _.tSong403Skip = 0;
        if (win.dzPlayer.getPosition() === 0 && win.dzPlayer.isPlaying()){
            GM_VALUES[win.dzPlayer.getSongId()]=true;
            win.dzPlayer.control.nextSong();
        }
    };

    // ASYNC SLOW
    _.tSlow = setInterval(function(){
        // Skip tracks
        if (win.dzPlayer){
            win.dzPlayer.setPropValue('skipRadioAllowed', toWin(function(){return true;}));

            // Tracks Location banned tracks
            _.triger = win.dzPlayer.trigger;
            win.dzPlayer.setPropValue('trigger', toWin(function(methodName, params){
                if ((['audioPlayer_playTracks','audioPlayer_appendTracks'].indexOf(methodName) !== -1)){
                    if (_.tSong403Skip){
                        clearTimeout(_.tSong403Skip);
                    }
                    _.tSong403Skip = setTimeout(toWin(_.Song403Skip), _.songTimeOut);
                }
                if ('audioPlayer_setToken' === methodName){
                   params = toWin([_.TokenECBBoost(params[0])]);
                }
                _.triger(methodName, params);
            }));
            clearInterval(_.tSlow);

        }
    }, 1000);

    // Hook for SYNC method
    win.Date.prototype.getTime = toWin(function(){
        _.func();
        return _.getTime.call(this);
    });

    _.func();
})(this, this.unsafeWindow || this, document, {songTimeOut:10000});
