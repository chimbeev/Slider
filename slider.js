let images = [{ //Создаем массив с картинками
    url: "http://localhost:63342/Slider/fotos/bigl.jpg",
    title: "Бигль"
}, {
    url: "http://localhost:63342/Slider/fotos/chihuahua.jpg",
    title: "Чихуа-Хуа"
}, {
    url: "http://localhost:63342/Slider/fotos/doberman.jpg",
    title: "Доберман"
}, {
    url: "http://localhost:63342/Slider/fotos/jack-rassel-teryer.jpg",
    title: "Джек Рассел Терьер"
}, {
    url: "http://localhost:63342/Slider/fotos/labrador_retriver.jpg",
    title: "Лабрадор ретривер"
}, {
    url: "http://localhost:63342/Slider/fotos/shpits.jpg",
        title: "Шпиц"
}, {
    url: "http://localhost:63342/Slider/fotos/siba-inu.jpg",
        title: "Шиба-Ину"
}, {
    url: "http://localhost:63342/Slider/fotos/teryer.jpg",
        title: "Терьер"
}, {
    url: "http://localhost:63342/Slider/fotos/yorkshir-teryer.jpg",
        title: "Йоркширский терьер"
}];

function initSlider(options) { //Функция для инициализации слайдера, передаем опции запуска (заголовки, точки, автопросмотр)
    if (!images || !images.length) return; //Если массив пустой или длина массива равна нулю то не запускаем

    options = options || { //Настройки по умолчанию если не указаны опции при запуске
        titles: false,
        dots: true,
        autoplay: false
    };

    let sliderImages = document.querySelector(".slider__images"); //Обращение к DOM элементу через queryselector
    //Обьект содержит картинки
    let sliderArrows = document.querySelector(".slider__arrows");//Обьект содержит стрелки
    let sliderDots = document.querySelector(".slider__dots");//Обьект содержит точки

    initImages(); //Показать картинки
    initArrows();//Показать стрелки


    if (options.dots) {
        initDots();
    }

    if (options.titles) {
        initTitles();
    }

    if (options.autoplay) {
        initAutoplay();
    }

    function initImages() { //Инициируем показ картинок
        images.forEach((image, index) => { //перебираем все картинки из массива и создаем для каждой картинки divы c классами: (image n[index] [index])
            let imageDiv = `<div class="image n${index} ${index === 0? "active" : ""}" style="background-image:url(${images[index].url}); background-size: cover;" data-index="${index}"></div>`;
            //Если картинка с индексом 0 , то ставим ей класс active, если нет то пусто. Указываем путь до картинки. И заводим дополнительное св-во data-index
            sliderImages.innerHTML += imageDiv; //выводим картинку на экран
        });
    }

    function initArrows() { // Инициируем показ стрелок
        sliderArrows.querySelectorAll(".slider__arrow").forEach(arrow => { //Для каждой стрелки добавляем событие
            arrow.addEventListener("click", function() { //При нажатии стрелки
                let curNumber = +sliderImages.querySelector(".active").dataset.index;//выясняем номер текущей картинки через св-во index
                //Которую завели через команду data-index="${index}". В этой команде data- откидывается и получаем index=${index}
                let nextNumber;
                if (arrow.classList.contains("left")) { //Если у текущей стрелки есть в списке класс left
                    nextNumber = curNumber === 0? images.length - 1 : curNumber - 1; //то если текущий номер картинки
                    // равен 0, то номер следующей картинки будет кол-во картинов минус один(Так как после нулевой картинки
                    //надо показать последнюю). Иначе номер следующей картинки будет номер тек картинки минус 1
                } else { //Если нету класса left значит стрелка вправо
                    nextNumber = curNumber === images.length - 1? 0 : curNumber + 1; //Если номер текущей картинки
                    // равен кол-ву картинок минус один , то присвоим номеру картинки ноль (надо после последней
                    // картинки показать нулевую), иначе к текущему номеру картинки прибавляем единицу
                }
                moveSlider(nextNumber); //меняем картинку
            });
        });
    }

    function initDots() { //Инициируем показ точек
        images.forEach((image, index) => { //Создаем divы c классами slider__dots-item n${index} active если это нулевая картинка
            let dot = `<div class="slider__dots-item n${index} ${index === 0? "active" : ""}" data-index="${index}"></div>`;
            sliderDots.innerHTML += dot; //рисуем через DOM обьект точки
        });
        sliderDots.querySelectorAll(".slider__dots-item").forEach(dot => { //на все обьекты точки
            //вешаем события клик мышки
            dot.addEventListener("click", function() {
                moveSlider(this.dataset.index); //по клику мышки вызываем покажи картинку с текущим индексом как у точки
            })
        })
    }

    function moveSlider(num) { //показывает картинку
        sliderImages.querySelector(".active").classList.remove("active");//у активной картинки убирает
        //метку что она активна
        sliderImages.querySelector(".n" + num).classList.add("active");
        if (options.dots) {
            sliderDots.querySelector(".active").classList.remove("active");
            sliderDots.querySelector(".n" + num).classList.add("active");
        }
        if (options.titles) changeTitle(num);
    }

    function initTitles() { //показывает подпись к картинке 0
        let titleDiv = `<div class="slider__images-title">${images[0].title}</div>`;
        sliderImages.innerHTML += cropTitle(titleDiv, 50);
    }

    function changeTitle(num) {
        if (!images[num].title) return; //Если нету подписи в массиве, то стоп и возврат
        let sliderTitle = sliderImages.querySelector(".slider__images-title"); //обращение через DOM обьект
        //.slider__images-title
        sliderTitle.innerText = cropTitle(images[num].title, 50); //записать в DOM обьект обрезанную подпись
    }

    function cropTitle(title, size) { //обрезать подпись до 50 символов
        if (title.length <= size) {
            return title;
        } else {
            return title.substr(0, size) + "...";
        }
    }

    function initAutoplay() { //автопоказ картинок
        setInterval(() => {
            let curNumber = +sliderImages.querySelector(".active").dataset.index;//узнать номер активной картинки
            let nextNumber = curNumber === images.length - 1? 0 : curNumber + 1; //если тек номер картинки равен последней
            // то номер след картинки 0. Иначе след картинка
            moveSlider(nextNumber);//показать картику
        }, options.autoplayInterval);
    }
}

let sliderOptions = {
    dots: true,
    titles: true,
    autoplay: true,
    autoplayInterval: 5000
};

document.addEventListener("DOMContentLoaded", function() {
    initSlider(sliderOptions);
});