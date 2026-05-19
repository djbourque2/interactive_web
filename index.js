var track = true;

function game_toggleImage() {
    if (track){
        document.getElementById('toggle').src = 'img/interactive_game_assets_tutorial2.png';
        track = false;
    } else {
        document.getElementById('toggle').src = 'img/interactive_game_assets_tutorial1.png';
        track = true;
    }

    document.getElementById('reappear').style.display = 'block';
}