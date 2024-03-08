document.querySelectorAll("img").forEach((item) => {
    //Add event listener to button element with event to reveal image
    item.addEventListener("click", (event) => {
      const image = event.target.getAttribute("data-src");
      event.target.setAttribute("src", image);
    });
  });

