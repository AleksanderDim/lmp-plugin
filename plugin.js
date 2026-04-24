(function () {
    'use strict';

    function startPlugin() {
        Lampa.Noty.show('UA-Plugin: Спроба інтеграції в розділ Детально');

        // Створюємо компонент, який відкриється при натисканні
        Lampa.Component.add('ua_online_mod', function (object) {
            var scroll = new Lampa.Scroll({ mask: true, over: true });
            this.create = function () {
                var _this = this;
                this.activity.loader(false);
                scroll.clear();
                var card = Lampa.Template.get('button', { 
                    title: 'Пошук джерел для: ' + (object.movie.title || object.movie.name) 
                });
                scroll.append(card);
                return scroll.render();
            };
        });

        // Слухаємо відкриття картки
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                // Шукаємо за текстом "Детально", оскільки класи можуть бути іншими
                setTimeout(function() {
                    // 1. Шукаємо блок, де написано "Детально"
                    var detailSection = $("div:contains('Детально'), .full-info__title:contains('Детально')").parent();
                    
                    if (detailSection.length && !$('.view--ua-online').length) {
                        // Створюємо кнопку, схожу на вашу "Дивитись"
                        var btn = $('<div class="full-start__button selector view--ua-online" style="margin-top: 10px; background: #24b47e !important;"><span>UA Онлайн</span></div>');
                        
                        btn.on('hover:enter click', function () {
                            Lampa.Activity.push({
                                title: 'UA Онлайн',
                                component: 'ua_online_mod',
                                movie: e.data.movie
                            });
                        });

                        // Вставляємо кнопку прямо ПІД розділ "Детально" або поруч із "Дивитись"
                        var mainButtons = $('.full-start__buttons, .movie-full__buttons');
                        if (mainButtons.length) {
                            mainButtons.append(btn);
                        } else {
                            detailSection.after(btn);
                        }
                        
                        // Оновлюємо навігацію пульта
                        Lampa.Controller.enable('full');
                    }
                }, 1000);
            }
        });
    }

    if (window.Lampa) startPlugin();
    else document.addEventListener('appready', startPlugin);
})();
