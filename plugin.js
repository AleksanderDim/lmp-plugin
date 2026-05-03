(function () {
    'use strict';

    function runHook() {
        if (!window.Lampa) {
            setTimeout(runHook, 2000);
            return;
        }

        Lampa.Noty.show('UAKino: Перехоплення пошуку...');

        // Перехоплюємо введення в пошуковому рядку
        if (Lampa.Search) {
            var originalSearch = Lampa.Search.search;
            
            Lampa.Search.search = function (query) {
                // Викликаємо оригінальний пошук, щоб не ламати інші функції
                originalSearch.apply(this, arguments);

                // Якщо пошук містить запит, додаємо кнопку переходу на сайт
                var $panel = $('.search__results');
                if ($panel.length && !$('.uakino-search-btn').length) {
                    var btn = $('<div class="button selector uakino-search-btn" style="margin-top:10px; background:#e50914; color:#fff; text-align:center; padding:10px;"><span>Знайти на UAKino.club</span></div>');
                    
                    btn.on('hover:enter click', function () {
                        window.open('https://uakino.club/index.php?do=search&subaction=search&story=' + encodeURIComponent(query), '_blank');
                    });
                    
                    $panel.prepend(btn);
                }
            };
        }
    }

    if (window.appready) {
        runHook();
    } else {
        document.addEventListener('appready', runHook);
    }
})();
