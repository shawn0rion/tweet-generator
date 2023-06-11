const numTweets = 10;
const openai_key = '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';
const twitter_key = 'EBPVETUs6YMX4ZzZQQj034fc7'

const form = document.querySelector('#tweet-form')
const tweetTopicInput = document.getElementById('tweet-topic');
const toneSelect = document.querySelector('select');
const resetButton = document.getElementById('reset');
const submitButton = document.getElementById('submit');
const displayContainer = document.querySelector('.display-container');
const loader = document.querySelector('.loader');

tweetTopicInput.value = 'AI will help us all become even more human!'
toneSelect.selectedIndex = 1;
form.addEventListener('reset', event => {
    form.reset();
})
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitButton.blur();
    if (!displayContainer.classList.contains('hide')) displayContainer.classList.add('hide');
    loader.classList.remove('hide');
    const selectValue = toneSelect.options[toneSelect.selectedIndex].value;
    const tweets = await generateResponse(tweetTopicInput.value, selectValue)
    displayTweets(tweets);
    displayContainer.classList.remove('hide');
    loader.classList.add('hide');
})

async function generateResponse(topic, tone){
    const context = `Topic: ${topic}; Tone: ${tone}; Tweet: `;
    const inputData = {
        model: 'text-davinci-003',
        prompt: context,
        max_tokens: 280,
        n: 10,
    }
    const url = `https://api.openai.com/v1/completions`;
    try{
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openai_key}`,
            },
            body: JSON.stringify(inputData),
        });
        const responseData = await response.json();
        // remove the first newline from each choices's text
        return responseData.choices.map(x => x.text.slice(2));
    } catch(error){
        console.error(error);
    }

}

function displayTweets(tweets){
    const tweetContainer = document.querySelector('.tweet-container');
    while(tweetContainer.firstChild){
        tweetContainer.removeChild(tweetContainer.firstChild);
    }

    tweets.forEach(tweetText => {
        const tweet = createTweet(tweetText);
        tweetContainer.appendChild(tweet);
    })
}

function getFormattedDate(){
    const d = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function createTweet(tweetText) {
    // Create elements
    const tweetDiv = document.createElement('div');
    const link = document.createElement('a');
    const icon = document.createElement('i');
    const tweetHeader = document.createElement('div');
    const userDetailsDiv = document.createElement('div');
    const img = document.createElement('img');
    const userTextDiv = document.createElement('div');
    const realnameP = document.createElement('p');
    const usernameP = document.createElement('p');
    const tweetTextDiv = document.createElement('div');
    const statsDiv = document.createElement('div');
    const heartIcon = document.createElement('i');
    const dateDiv = document.createElement('div');

    // Set attributes and content
    tweetDiv.className = 'tweet';
    link.className = 'twitter-link';
    link.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    icon.className = 'fab fa-twitter';
    tweetHeader.className = 'tweet-header';
    userDetailsDiv.className = 'user-details';
    img.className = 'pfp';
    img.src = 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg';
    img.alt = '';
    userTextDiv.className = 'user-text';
    realnameP.className = 'realname';
    realnameP.textContent = 'Your Name';
    usernameP.className = 'username';
    usernameP.textContent = '@username';
    tweetTextDiv.className = 'tweet-text';
    tweetTextDiv.innerHTML = tweetText; // Using innerHTML to allow HTML in the tweet text
    statsDiv.className = 'tweet-stats';
    heartIcon.className = 'far fa-heart';
    dateDiv.className = 'date-posted';
    dateDiv.textContent = getFormattedDate();

    // Assemble structure
    link.appendChild(icon);
    userTextDiv.appendChild(realnameP);
    userTextDiv.appendChild(usernameP);
    userDetailsDiv.appendChild(img);
    userDetailsDiv.appendChild(userTextDiv);
    statsDiv.appendChild(heartIcon);
    statsDiv.appendChild(dateDiv);
    tweetHeader.appendChild(userDetailsDiv);
    tweetHeader.appendChild(link);
    tweetDiv.appendChild(tweetHeader);
    tweetDiv.appendChild(tweetTextDiv);
    tweetDiv.appendChild(statsDiv);

    // Append the tweet to the body (or another container)
    return tweetDiv;
}

// async function getUserData(username){
//     const url = `https://api.twitter.com/2/users/by/username/${username}`;
//     const headers = {
        
//         'Authorization': `Bearer ${twitter_key}`
//     }
//     try{
//         const response = await fetch(url, { headers: headers});
//         const data = await response.json();
//         return {
//             profile_image_url: data.data.profile_image_url,
//             realname: data.data.name,
//             username: username,
//         }
//     } catch (error){
//         console.error(error);
//     }
// }

// getUserData('jack')