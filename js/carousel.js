document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel');
    const items = carousel.querySelectorAll('.carousel-item');
    const prevButton = carousel.querySelector('.carousel-control.prev');
    const nextButton = carousel.querySelector('.carousel-control.next');

    let currentIndex = 0;
    const totalItems = items.length;
    let autoPlayInterval;

    function showSlide(index) {
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }

    function showNextSlide() {
        currentIndex = (currentIndex + 1) % totalItems;
        showSlide(currentIndex);
    }

    function showPrevSlide() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        showSlide(currentIndex);
    }

    nextButton.addEventListener('click', () => {
        showNextSlide();
        resetAutoPlay();
    });

    prevButton.addEventListener('click', () => {
        showPrevSlide();
        resetAutoPlay();
    });

    function startAutoPlay() {
        autoPlayInterval = setInterval(showNextSlide, 4000); // cada 4 segundos
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // Inicialización
    showSlide(currentIndex);
    startAutoPlay();
});
