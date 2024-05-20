const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

function speak(sentence) {
    const textToSpeak = new SpeechSynthesisUtterance(sentence);
    textToSpeak.lang = 'en-US'; // Change language code as needed
    textToSpeak.rate = 1;
    textToSpeak.pitch = 1;

    window.speechSynthesis.speak(textToSpeak);
}

function changeInputStyle() {
    inputContainer.classList.add('active');
}

function resetInputStyle() {
    inputContainer.classList.remove('active');
}

function wishMe() {
    const day = new Date();
    const hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good morning! I hope you're having a wonderful start to your day.");
    } else if (hour === 12) {
        speak("Good noon! It's midday, and I'm here to assist you.");
    } else if (hour > 12 && hour <= 17) {
        speak("Good afternoon! How can I be of service during this lovely afternoon?");
    } else {
        speak("Good evening! As the day comes to a close, I'm here to help you.");
    }
}

window.addEventListener('load', () => {
    speak("Activating. Stand by as I come online to assist you.");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    content.textContent = transcript;
    processUserInput(transcript.toLowerCase());
};

btn.addEventListener('click', () => {
    recognition.start();
    changeInputStyle();
});

async function processUserInput(message) {
    const speech = new SpeechSynthesisUtterance();

    if (message.includes('hey') || message.includes('hello')) {
        const finalText = "Hello there! It's always a pleasure to greet you. How can I assist you today?";
        speech.text = finalText;
    } else if (message.includes('how are you')) {
        const finalText = "I'm doing well, thank you for asking! How can I be of service to you today?";
        speech.text = finalText;
    } else if (message.includes('name')) {
        const finalText = "My name is Webby, and I was developed by John Rey Poras. How can I help you further?";
        speech.text = finalText;
    } else if (message.includes('do you know John Rey?')) {
        const finalText = "Yes, he is my creator. How can I assist you today?";
        speech.text = finalText;
    } else if (message.includes('open google')) {
        window.open("https://google.com", "_blank");
        const finalText = "You got it! I'm opening Google for you. What would you like to search for?";
        speech.text = finalText;
    } else if (message.includes('open instagram')) {
        window.open("https://instagram.com", "_blank");
        const finalText = "Instagram is on its way! What's your next destination on the internet?";
        speech.text = finalText;
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        const query = message.replace('what is', '').replace('who is', '').replace('what are', '').trim();
        speak(`Webby, what is ${query}?`);
        const finalText = await getApiResponse(query);
        speech.text = finalText;
    } else if (message.includes('wikipedia')) {
        const query = message.replace('wikipedia', '').trim();
        const wikipediaUrl = `https://en.wikipedia.org/wiki/${query}`;
        window.open(wikipediaUrl, "_blank");
        const finalText = `You've chosen a reliable source! I'm looking up information about ${query} on Wikipedia. Give me a moment to find the details.`;
        speech.text = finalText;
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        const finalText = `The current time is ${time}. How else can I assist you today?`;
        speech.text = finalText;
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "long", day: "numeric" });
        const finalText = `Today's date is ${date}. What else would you like to know or do?`;
        speech.text = finalText;
    } else if (message.includes('calculator')) {
        window.open('Calculator:///');
        const finalText = "I've activated the calculator for you. Ready to crunch some numbers?";
        speech.text = finalText;
    } else if (message.includes('search')) {
        const query = message.replace('search', '').trim();
        const searchUrl = `https://www.google.com/search?q=${query.replace(" ", "+")}`;
        window.open(searchUrl, "_blank");
        const finalText = `I've initiated a search for ${query}. Please wait while I retrieve the results for you.`;
        speech.text = finalText;
    } else {
        speak(`${message}`);
        const finalText = await getApiResponse(message);
        speech.text = finalText;
    }

    speech.volume = 1;
    speech.pitch = 1;
    speech.rate = 1;

    window.speechSynthesis.speak(speech);
    resetInputStyle();
}

async function getApiResponse(query) {
    const apiUrl = `https://api.easy-api.online/v1/globalgpt?q=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.content) {
            return data.content;
        } else {
            return "I'm sorry, I couldn't find any information on that topic.";
        }
    } catch (error) {
        console.error('Error fetching API response:', error);
        return "I'm sorry, but I couldn't fetch the information you requested. Please try again later.";
    }
}
