var lpApp = angular.module('lpApp', []);

lpApp.controller('lpPriceCtrl', ['$scope', '$http', function ($scope, $http) {

    $http.get('price.json').then(function (response) {
        $scope.prices = response.data;
        $scope.calc();
        $scope.sortGet();
    });

    $scope.calc = function () {
        $scope.prices.forEach(function (price, i) {
            $scope.prices[i].sum = $scope.prices[i].price * (1 - $scope.prices[i].discount);
        });
    }

    $scope.sortSet = function (propertyName) {
        if ($scope.sortBy == propertyName) $scope.sortRev = !$scope.sortRev;
        $scope.sortBy = propertyName;
        localStorage.sortBy = $scope.sortBy;
        localStorage.sortRev = $scope.sortRev;
    }

    $scope.sortGet = function () {
        if (localStorage.sortBy && localStorage.sortRev) {
            $scope.sortBy = localStorage.sortBy;
            $scope.sortRev = localStorage.sortRev == 'true';
        } else {
            $scope.sortBy = 'name';
            $scope.sortRev = false;
        }
    }

}]);

(function ($) {
    $(document).ready(function () {

        /* Панель навигации */
        // Описываем функцию, которая
        function lpHeader() {
            if ($(window).scrollTop() == 0) { // Если находимся в начале страницы
                $('header').addClass('top'); // Добавляет класс top для панели
            } else { // Иначе
                $('header.top').removeClass('top'); // Удаляет его
            }
        }
        // Вызываем эту функцию
        lpHeader(); // Единожды при загрузке страницы
        $(window).on('scroll', lpHeader); // И каждый раз при скролле

        /* Плавный скролл при клике на ссылку в меню */
        // Помещаем набор ссылок в переменную
        var lpMenuItems = $('ul.nav li a');
        // Для каждой ссылке в наборе
        lpMenuItems.each(function () {
            // Помещаем в переменные
            var link = $(this), // Саму ссылку
                linkHref = link.attr('href'), // Путь, на который она ссылается
                linkTrgt = $(linkHref); // Объект, на который она ссылается
            // Если таковой объект существует
            if (linkTrgt.length > 0) {
                // То добавляем обработчик на клик по ссылке
                link.on('click', function (e) {
                    // Отменяем переход по умолчанию
                    e.preventDefault();
                    // Вычисляем отступ до объекта-назначения
                    var offset = linkTrgt.offset().top;
                    // И плавно скроллим страницу к этой точке
                    $('body, html').animate({
                        scrollTop: offset - 40
                    }, 750);
                });
            }
        });

        /* Отслеживание активного экрана */
        // Объявляем массив
        var lpNavItems = [];
        // Описываем функцию, которая
        function lpSetNavItems() {
            // Обнуляем массив с информацией об экранах
            lpNavItems = [];
            // Помещает в массив для каждого экрана
            $('section').each(function () {
                lpNavItems.push({
                    top: $(this).offset().top, // Его отступ от начала экрана
                    name: $(this).attr('id') // Значение ID
                });
            });
        }
        // Вызываем эту функцию
        lpSetNavItems(); // Единожды при загрузке страницы
        $(window).on('resize', lpSetNavItems); // И каждый раз при изменении размера окна

        /* Начальный экран при загрузке */
        // Описываем функцию, которая скролит страницу к экрану, имя которого есть в URL
        var lpPath = location.pathname.replace('/', '');

        function lpGoToActive() {
            lpNavItems.forEach(function (item) {
                if (item.name == lpPath) {
                    setTimeout(function () {
                        $('body, html').scrollTop(item.top - 40);
                    }, 500);
                }
            });
        }
        // Вызываем эту функцию
        lpGoToActive(); // При загрузке DOM
        $(window).on('load', lpGoToActive); // При загрузке страницы

        // Описываем функцию, которая вычисляет активный экран
        function lpSetNavActive() {
            // В этой переменной в конце forEach будет ID активного экрана
            var curItem = '';
            // Чтобы он туда попал, перебираем все экраны
            lpNavItems.forEach(function (item) {
                // И если положение экрана от начала страницы меньше текущего скролла
                if ($(window).scrollTop() > item.top - 200) {
                    curItem = item.name; // В переменную вносим ID этого экрана
                }
            });
            // Далее, если href ссылки внутри активного пункта меню не совпадает с ID найденного нами активного экрана
            // Либо активные элементы отсутствуют в меню
            if ($('ul.nav li.active a').attr('href') != '#' + curItem || $('ul.nav li.active').length == 0) {
                // Удаляем класс у текущего активного элемента
                $('ul.nav li.active').removeClass('active');
                // И добавляем класс active пункту, внутри которого лежит ссылка, у которой href совпал с ID активного экрана 
                $('ul.nav li a[href="#' + curItem + '"]').parent().addClass('active');
                // Задаем состояние
                history.pushState({
                    curItemName: curItem
                }, curItem, '/' + curItem);
            }
        }
        // Вызываем эту функцию
        lpSetNavActive(); // Единожды при загрузке страницы
        $(window).on('scroll', lpSetNavActive); // И каждый раз при скролле

        /* Слайдшоу */

        $('.lp-slider1').owlCarousel({
            items: 1,
            nav: true,
            navText: ['<i class="fa fa-arrow-left"></i>', '<i class="fa fa-arrow-right"></i>'],
            animateOut: 'fadeOut'
        });

        $('.lp-slider2').owlCarousel({
            items: 4,
            nav: true,
            navText: ['<i class="fa fa-arrow-left"></i>', '<i class="fa fa-arrow-right"></i>']
        });

        /* Табулятор */

        // Для каждого табулятора на странице
        $('.lp-tabs').each(function () {
            // Помещаем корневой div в переменную tabs 
            var tabs = $(this),
                tabsTitlesNames = []; // А также объявляем массив, в котором будем хранить имена вкладок
            // Сохраняем все имена вкладок в массив
            tabs.find('div[data-tab-title]').each(function () {
                tabsTitlesNames.push($(this).attr('data-tab-title'));
            }).addClass('lp-tab');
            // Между корневым div и его содержимым добавляем div с классом "lp-tabs-content"
            tabs.wrapInner('<div class="lp-tabs-content"></div>');
            // В начало корневого div добавляем div с классом "lp-tabs-titles" и списком внутри
            tabs.prepend('<div class="lp-tabs-titles"><ul></ul></div>');
            // Помещаем в переменные:
            var tabsTitles = tabs.find('.lp-tabs-titles'), // Div c заголовками вкладок
                tabsContent = tabs.find('.lp-tabs-content'), // Div с содержимым вкладок
                tabsContentTabs = tabsContent.find('div[data-tab-title]'); // Набор вкладок
            // Добавляем заголовки вкладок
            tabsTitlesNames.forEach(function (value) {
                tabsTitles.find('ul').append('<li>' + value + '</li>');
            });
            // Помещаем в переменную набор заголовков вкладок
            var tabsTitlesItems = tabsTitles.find('ul li');
            // Добавляем класс "active" первому заголовку
            tabsTitlesItems.eq(0).addClass('active');
            // Добавляем класс "active" первой вкладке и отображаем ее
            tabsContentTabs.eq(0).addClass('active').show();
            // Устанавливаем высоту div с содержимым вкладок равной высоте первой вкладки
            tabsContent.height(tabsContent.find('.active').outerHeight());
            // По клику на заголовке вкладки
            tabsTitlesItems.on('click', function () {
                // Проверяем, не находится ли табулятор в переходном состоянии
                if (!tabs.hasClass('changing')) {
                    // Если нет, то добавляем класс "changing", обозначающий переходное состояние
                    tabs.addClass('changing');
                    // Помещаем в переменные:
                    var curTab = tabsContent.find('.active'), // Активную вкладку
                        nextTab = tabsContentTabs.eq($(this).index()); // Следующую вкладку
                    // Убираем класс "active" у активного заголовка
                    tabsTitlesItems.removeClass('active');
                    // Добавляем класс "active" заголовку, по которому кликнули
                    $(this).addClass('active');
                    // Помещаем в переменную текущую высоту контента
                    var curHeight = curTab.outerHeight();
                    // Отображаем следующую вкладку
                    nextTab.show();
                    // Помещаем в переменную высоту контента следующей вкладки
                    var nextHeight = nextTab.outerHeight();
                    // Прячем следующую вкладку, пока никто ее не увидел
                    nextTab.hide();
                    // Если высота контента следующей вкладки больше
                    if (curHeight < nextHeight) {
                        // То плавно увеличиваем высоту блока с контентом до нужной высоты
                        tabsContent.animate({
                            height: nextHeight
                        }, 500);
                    }
                    // И параллельно прячем текщую вкладку
                    curTab.fadeOut(500, function () {
                        // По окончании анимации
                        // Если высота контента следующей вкладки меньше
                        if (curHeight > nextHeight) {
                            // То плавно уменьшаем высоту блока с контентом до нужной высоты
                            tabsContent.animate({
                                height: nextHeight
                            }, 500);
                        }
                        // И параллельно отображаем следующую вкладку
                        nextTab.fadeIn(500, function () {
                            // По окончании анимации
                            // Удаляем класс "active" у текущей (уже прошлой) вкладки
                            curTab.removeClass('active');
                            // Добавляем класс "active" следующей (уже текущей) вкладке
                            nextTab.addClass('active');
                            // Выводим табулятор из переходного состояния
                            tabs.removeClass('changing');
                        });
                    });

                }
            });
            // При изменении размера окна
            $(window).on('resize', function () {
                // Устанавливаем высоту div с содержимым вкладок равной высоте активной вкладки
                tabsContent.height(tabsContent.find('.active').outerHeight());
            });
        });

        /* Модальные окна */

        $('.lp-mfp-inline').magnificPopup({
            type: 'inline'
        });

        $('.lp-gallery').each(function () {
            $(this).magnificPopup({
                delegate: 'a',
                type: 'image',
                gallery: {
                    enabled: true
                }
            });
        });

        /* Формы обратной связи */

        $('#lp-fb1').wiFeedBack({
            fbScript: 'blocks/wi-feedback.php',
            fbLink: false,
            fbColor: '#6f11a8'
        });

        $('#lp-fb2').wiFeedBack({
            fbScript: 'blocks/wi-feedback.php',
            fbLink: '.lp-fb2-link',
            fbColor: '#6f11a8'
        });

    });
})(jQuery);

/* Карта */

function lpMapInit() {

    var lpMapOptions = {
        center: [53.906522, 27.510232],
        zoom: 16,
        controls: ['zoomControl']
    }

    if (window.innerWidth < 768) lpMapOptions.behaviors = ['multiTouch'];
    else lpMapOptions.behaviors = ['drag'];

    var lpMap = new ymaps.Map('lp-map', lpMapOptions);

    var lpPlacemark = new ymaps.Placemark(lpMapOptions.center, {
        hintContent: 'ИТ Академия',
        balloonContentHeader: 'ИТ Академия',
        balloonContentBody: 'учебные курсы',
        balloonContentFooter: 'пер. 4-й загородный, 56А'
    });

    lpMap.geoObjects.add(lpPlacemark);

}