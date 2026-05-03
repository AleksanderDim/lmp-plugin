(function () {
    'use strict';

    function manualPlugin() {
        if (window.Lampa && Lampa.Platform) {
            Lampa.Noty.show('UAKino: Запуск модуля...');

            // Відкриваємо сайт UAKino у вбудованому браузері або через вікно Lampa
            try {
                if (Lampa.Activity) {
                    Lampa.Activity.push({
                        title: 'UAKino Онлайн',
                        url: 'https://uakino.club',
                        component: 'full', // Використовуємо стандартний компонент перегляду Lampa
                        movie: {
                            title: 'UAKino',
                            name: 'UAKino'
                        }
                    });
                }
            } catch (e) {
                // Якщо ядро заблоковано, використовуємо системний метод
                window.open('https://uakino.club', '_blank');
            }
        }
    }

    // Запускаємо відразу після ініціалізації
    if (window.appready) {
        manualPlugin();
    } else {
        document.addEventListener('appready', manualPlugin);
        setTimeout(manualPlugin, 4000);
    }
})();
