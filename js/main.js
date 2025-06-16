var lastUrl = localStorage.getItem('lastUrl');
var iframeInput = document.getElementById('iframeInput'); 
var videoDiv = document.getElementById('videoDiv'); 
var urlHistory = localStorage.getItem('urlHistory') || [];
iframeInput.value = lastUrl ? lastUrl : "";
videoDiv.innerHTML = localStorage.getItem('lastIframe')

function convertToEmbedUrl(youtubeUrl) {
    try {
        const url = new URL(youtubeUrl);
        let videoId = "";

        if (url.hostname.includes("youtube.com")) {
            videoId = url.searchParams.get("v");
        } else if (url.hostname === "youtu.be") {
            videoId = url.pathname.slice(1);
        }
        if (!videoId) throw new Error("Invalid YouTube URL");
        localStorage.setItem('lastUrl', youtubeUrl);        
        urlHistory.push(youtubeUrl);
        // if urlHistory.includes() // check if the link already exsit <<<
        localStorage.setItem('urlHistory', urlHistory);
        console.log(urlHistory);

        return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) {
        return null;
    }
}

function showVideo(){ 
    const embedUrl = convertToEmbedUrl(iframeInput.value);

    if (!embedUrl) {
        videoDiv.innerHTML = "<p style='color: red;'>Invalid YouTube URL</p>";
        return;
    }
    videoDiv.innerHTML = `<iframe width="885" height="498" frameborder="0" allowfullscreen></iframe>`;
    var iframe = videoDiv.getElementsByTagName('iframe')[0];
    videoDiv.classList.replace('d-none', 'd-block');
    
    // iframe.classList.add("rounded-5", "shadow"); 
    iframe.src = embedUrl + "?rel=0";
    localStorage.setItem('lastIframe', videoDiv.innerHTML);
    console.log(localStorage.getItem('lastIframe'));
}

var themeToggleBtn = document.getElementById('themeToggler');
function switchMode(){
    htmlTag = document.documentElement;
    // console.log(htmlTag.dataset.bs.theme);
    var currentTheme = htmlTag.getAttribute('data-bs-theme');
    var newTheme = "light"
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
