const url = "https://gtrend.yapie.me/repositories?language=javascript&since=";
const peopleList = document.querySelector(".no");
const btn = document.querySelector(".btn");
function generateHtml(item) {
	console.log(item);
	const { name, author, avatar, description, url, language, stars, forks } =
		item;
	const section = document.createElement("card");
	peopleList.appendChild(section);
	const innerData = `<div class="in-one">
   <img src=${avatar} alt=${name}>
  </div>
  <div class="in-two">
   <h1>${author.toUpperCase()}</h1>
   <p>${description}</p>
   <div class="tags">
    <span>Name: ${name}</span>
    <span>Language: ${language}</span>
    <span>Stars: ${stars}</span>
    <span>Forks: ${forks}</span>
   </div>
  </div>
  <div class="in-three">
   <button>
					<a href="${url}">Repo</a>
				</button>
  </div>`;
	section.innerHTML = innerData;
}

fetch(url)
	.then((res) => res.json())
	.then((data) =>
		data.map((item) => {
			btn.addEventListener("click", (e) => {
				generateHtml(item);
				e.target.remove();
			});
		})
	);
