var lyrics, urlParams, musicIDs, displayText, displayTitle;
var curMusic, buttonLeft, buttonRight, mode;

class Lyric {
    constructor(id=null, title=null, lyric=null) {
        this.id = id;
        this.title = title;
        this.lyric = lyric;
    }

    getTitle() {
        return this.title.toUpperCase();
    }

    getLyric() {
        let text = "";

        text += this.lyric.join("\n").toUpperCase();

        return text;
    }
}

class Lyrics {
    constructor() {
        this.lyrics = [];
    }

    input(text) {
        let bruteList = text.replaceAll("\r", "").split("\n#\n\n");
        
        bruteList.forEach((e,i) => {
            let lines = e.split("\n");
            let title = lines[0];
            let lyric = lines.slice(2);
            let obj = new Lyric(i, title, lyric);
            this.lyrics.push(obj);
        });
    }

    findId(title) {
        for(let i=0; i<this.lyrics.length; i++) {
            if(title.toLowerCase() == this.lyrics[i].title.toLowerCase()) {
                return this.lyrics[i].id;
            }
        }
        return null;
    }

    find(title) {
        for(let i=0; i<this.lyrics.length; i++) {
            if(title.toLowerCase() == this.lyrics[i].title.toLowerCase()) {
                return this.lyrics[i];
            }
        }
        return null;
    }

    get(id) {
        for(let i=0; i<this.lyrics.length; i++) {
            if(id == this.lyrics[i].id) {
                return this.lyrics[i];
            }
        }
        return null;
    }

    getLyric(id) {
        return this.get(id).getLyric();
    }
}

function readFile(filename, func) {
    fetch(filename)
    .then((res) => res.text())
    .then((text) => {
        func(text);
    })
    .catch((e) => console.error(e));
}

function getURLParam() {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    return urlParams;
}

function main() {
    displayTitle = document.getElementById("page");
    displayText = document.getElementById("text");
    buttonLeft = document.getElementById("pageLeft");
    buttonRight = document.getElementById("pageRight");

    lyrics = new Lyrics();
    urlParams = getURLParam();
    musicIDs = urlParams.get("id").split(",").map(e=>{return parseInt(e);});
    curMusic = 0;
    mode = urlParams.get("mode");

    buttonLeft.innerText = "<";
    buttonRight.innerText = ">";

    if(mode == null || mode == "black") {
        blackMode();
    } else {
        whiteMode();
    }

    readFile("ICC_Lyrics.txt", (text)=>{
        lyrics.input(text);
        process();
    });

    buttonLeft.addEventListener("click", funcLeft);
    buttonRight.addEventListener("click", funcRight);
}

function setLyric(number, id) {
    let obj = lyrics.get(id);

    displayTitle.innerText = number + ". " + obj.getTitle();
    displayText.innerText = obj.getLyric();
}

function process() {
    setLyric(curMusic+1, musicIDs[curMusic]);
}

function funcLeft(e) {
    if(curMusic <= 0) {return;}

    curMusic--;
    setLyric(curMusic+1, musicIDs[curMusic]);
}

function funcRight(e) {
    if(curMusic >= musicIDs.length-1) {return;}

    curMusic++;
    setLyric(curMusic+1, musicIDs[curMusic]);
}

function printTitleList() {
    let titleList=lyrics.lyrics.map(e=>{return e.id+": "+e.title}).join("\n");
    console.log(titleList)
}

function blackMode() {
    displayText.className = "black";
    document.body.className = "black";
}

function whiteMode() {
    displayText.className = "white";
    document.body.className = "white";
}
