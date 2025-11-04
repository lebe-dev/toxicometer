// Токсикометр - JavaScript
(function() {
    'use strict';

    // Получаем элементы
    const needle = document.getElementById('needle');
    const buttons = document.querySelectorAll('.btn');

    // Создаём аудио элементы для звуков
    const medSound = new Audio('sounds/med-rad.mp3');
    const highSound = new Audio('sounds/high-rad.mp3');

    // Настраиваем звуки для зацикленного воспроизведения
    medSound.loop = true;
    highSound.loop = true;
    medSound.volume = 0.7;
    highSound.volume = 0.7;

    /**
     * Генерирует случайное число в заданном диапазоне
     * @param {number} min - Минимальное значение
     * @param {number} max - Максимальное значение
     * @returns {number} Случайное число
     */
    function getRandomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Останавливает все звуки
     */
    function stopAllSounds() {
        medSound.pause();
        highSound.pause();
        medSound.currentTime = 0;
        highSound.currentTime = 0;
    }

    /**
     * Управляет воспроизведением звуков в зависимости от зоны
     * @param {number} zone - Номер зоны (1, 2, 3)
     */
    function manageSounds(zone) {
        switch(zone) {
            case 1: // Зелёная зона - без звука
                stopAllSounds();
                break;
            case 2: // Жёлтая зона - средний уровень радиации
                highSound.pause();
                medSound.play().catch(e => console.log('Ошибка воспроизведения:', e));
                break;
            case 3: // Красная зона - высокий уровень радиации
                medSound.pause();
                highSound.play().catch(e => console.log('Ошибка воспроизведения:', e));
                break;
        }
    }

    /**
     * Конвертирует процент в угол поворота стрелки
     * @param {number} percent - Процент (0-100)
     * @returns {number} Угол в градусах (-90 до 90)
     */
    function percentToAngle(percent) {
        // 0% = -90°, 100% = 90°
        return (percent * 1.8) - 90;
    }

    /**
     * Устанавливает положение стрелки
     * @param {number} percent - Процент токсичности (0-100)
     */
    function setNeedlePosition(percent) {
        const angle = percentToAngle(percent);
        needle.style.transform = `rotate(${angle}deg)`;
    }

    /**
     * Обрабатывает клик по кнопке зоны
     * @param {number} zone - Номер зоны (1, 2, 3)
     */
    function handleZoneClick(zone) {
        let percent;

        switch(zone) {
            case 1: // Зелёная зона (LOW) - 0-20%
                percent = getRandomInRange(0, 20);
                break;
            case 2: // Жёлтая зона (MEDIUM) - 20-60%
                percent = getRandomInRange(20, 60);
                break;
            case 3: // Красная зона (HIGH) - 60-100%
                percent = getRandomInRange(60, 100);
                break;
            default:
                percent = 40;
        }

        setNeedlePosition(percent);
        manageSounds(zone);

        // Добавляем небольшую вибрацию кнопке для обратной связи
        const button = document.querySelector(`[data-zone="${zone}"]`);
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 100);
    }

    // Инициализация: устанавливаем стрелку на начальную позицию (середина MEDIUM зоны)
    setNeedlePosition(40);

    // Добавляем обработчики событий на кнопки
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const zone = parseInt(this.getAttribute('data-zone'));
            handleZoneClick(zone);
        });
    });

    // Добавляем поддержку клавиатуры (1, 2, 3)
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        if (key === '1' || key === '2' || key === '3') {
            handleZoneClick(parseInt(key));
        }
    });

})();
