const lastUrl = localStorage.getItem('lastUrl');
const iframeInput = document.getElementById('iframeInput'); 
const videoDiv = document.getElementById('videoDiv'); 
const urlHistory = JSON.parse(localStorage.getItem('urlHistory') || '[]');
const historyDiv = document.getElementById('historyDiv')
iframeInput.value = lastUrl ? lastUrl : "";
videoDiv.innerHTML = localStorage.getItem('lastIframe')

function convertToEmbedUrl(youtubeUrl, msg) {
    const url = new URL(youtubeUrl);
    let videoId = "";
    if (url.hostname.includes("youtube.com")) {
        videoId = url.searchParams.get("v");
    } else if (url.hostname === "youtu.be") {
        videoId = url.pathname.slice(1);
    }
    if (!videoId) throw new Error("Invalid YouTube URL");

    localStorage.setItem('lastUrl', youtubeUrl); 
    let oldVideo = urlHistory.find(obj=> obj.id == videoId);  
    if (!msg) console.log("youtube url: ", youtubeUrl);
     
    // console.log('before unshift', urlHistory);
    if (!oldVideo){
        urlHistory.unshift({id:videoId, url:youtubeUrl, title: "no title", date:new Date().toISOString()});
        // console.log('after unshift', urlHistory);
        console.log('video is new');
        
    }
    else{
        // console.log("index of log: ",urlHistory.indexOf(oldVideo), urlHistory[urlHistory.indexOf(oldVideo)]);
        urlHistory.splice(urlHistory.indexOf(oldVideo), 1)
        urlHistory.unshift(oldVideo);
        console.log(urlHistory.indexOf(oldVideo),'url already exists');
    }
    // console.log('after all', urlHistory);
    saveHistoryList();

    return `https://www.youtube.com/embed/${videoId}`;
} 

function showVideo(){
    embedUrl = convertToEmbedUrl(iframeInput.value);
    if (!embedUrl) {
        videoDiv.innerHTML = "<p style='color: red;'>Invalid YouTube URL</p>";
        return;
    }
    videoDiv.innerHTML = `<iframe width="885" height="498" frameborder="0" allowfullscreen></iframe>`;
    let iframe = videoDiv.getElementsByTagName('iframe')[0];
    videoDiv.classList.replace('d-none', 'd-block');
    
    // iframe.classList.add("rounded-5", "shadow"); 
    iframe.src = embedUrl + "?rel=0";
    localStorage.setItem('lastIframe', videoDiv.innerHTML);
    // console.log(localStorage.getItem('lastIframe'));
    displayHistory();
}
function displayHistory(){
    if(urlHistory){
        let i = urlHistory.length;
        let cartona = [];
        urlHistory.forEach(function(video){
            cartona += `
            <div class="mb-3 bg-secondary-subtle rounded-5 p-3">
                <h5>
                ${video.title}
                <button class="btn btn-sm rounded-circle text-danger" onclick="changeVideoTitle('${video.id}')">
                <i class="fa fa-pen"></i>
                </button>
                </h5>
                <p>id: ${video.id}</p>
                <p>${video.url}</p>
                <p>date: ${video.date}</p>
        
                <div class="btnsDiv d-flex justify-content-end gap-2">
                    <button class="btn btn-sm btn-outline-danger rounded-pill" onclick="deleteFromHistory('${video.id}')">
                    delete</button>
                    <a href="#videoDiv" class="btn btn-sm btn-danger rounded-pill" 
                    onclick="showVideoFromHistory('${video.url}')">Watch again</a>
                </div>

            </div>
            `
            i--;
        })
        historyDiv.innerHTML = cartona;
    }
}
function showVideoFromHistory(url){
    iframeInput.value = url;
    showVideo();
}
function changeVideoTitle(id){
    if(urlHistory){
        let currentVideo = urlHistory.find(v => v.id == id);
        let newTitle = prompt('add new title');
        if(newTitle) currentVideo.title = newTitle;
        urlHistory.splice(urlHistory.indexOf(currentVideo), 1, currentVideo)
        console.log(urlHistory);
        saveHistoryList();
        displayHistory();
    }
}
function deleteFromHistory(id){
    if(urlHistory){
        let currentVideo = urlHistory.find(v => v.id == id);
        console.log(currentVideo);
        urlHistory.splice(urlHistory.indexOf(currentVideo), 1);
        saveHistoryList();
        displayHistory();
    }
}   
function saveHistoryList(){
    localStorage.setItem('urlHistory', JSON.stringify(urlHistory));
}
const themeToggleBtn = document.getElementById('themeToggler');
function switchMode(){
    htmlTag = document.documentElement;
    // console.log(htmlTag.dataset.bs.theme);
    let currentTheme = htmlTag.getAttribute('data-bs-theme');
    let newTheme = "light"
    if(currentTheme === 'dark'){
        themeToggleBtn.classList.replace('text-light', 'text-warning')
        themeToggleBtn.innerHTML = `<i class="fa-solid fa-lightbulb"></i>`
    }
    else if (currentTheme === 'light'){
        newTheme = 'dark';
        themeToggleBtn.classList.replace('text-warning', 'text-light')
        themeToggleBtn.innerHTML=`<i class="fa-regular fa-lightbulb"></i>`
    }
    htmlTag.setAttribute('data-bs-theme', newTheme)
}

displayHistory();
