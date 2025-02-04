let buttonInstallLoader = null;
let buttonInstallText = null;
let installHideTimeout = null;
let fakeButtonLoaders = null;
let installButtonType = null;
let matchTheme = null;
let EBtEl = document.getElementById('expand-button');
let text = document.getElementById('text');
let shadow = document.querySelector('.description__content .shadow');
const showText = EBtEl.getAttribute('data-show');
const hideText = EBtEl.getAttribute('data-hide');

EBtEl.innerText = showText;
EBtEl.addEventListener('click', () => {
  if (EBtEl.innerText === showText) {
    EBtEl.innerText = hideText;
    text.className = text.className.replace(/\bcollapsed\b/g, '');
    shadow.style.display = 'none';
  } else {
    EBtEl.innerText = showText;
    text.className += 'collapsed';
    shadow.style.display = 'block';
  }
});

const showButtonInstallLoader = () => {
  buttonInstallLoader.forEach((elem) => (elem.style.display = 'block'));
  buttonInstallText.forEach((elem) => (elem.style.display = 'none'));
}

const hideButtonInstallLoader = () => {
  buttonInstallLoader.forEach((elem) => (elem.style.display = 'none'));
  buttonInstallText.forEach((elem) => (elem.style.display = 'block'));
}

const fakeButtonLoading = () => {
  const progressNumbers = [
    4, 4, 2, 4, 1, 2, 0, 3, 3, 5, 1, 4, 2, 3, 3, 2, 3, 5, 7, 3, 5, 6, 3, 6, 4,
    4, 2, 5, 0, 4,
  ];
  let sum = 0;
  let index = 0;
  if (fakeButtonLoaders) {
    const interval = setInterval(() => {
      sum += progressNumbers[index];
      fakeButtonLoaders.forEach((elem) => {
        elem.innerHTML = `${sum}%`;
      });

      if (sum >= 100) {
        clearInterval(interval);
      }
      index++;
    }, 1000);
  }
};

async function asyncTimeout(cb, time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      cb();
      resolve(true);
    }, time);
  });
}

async function isInstalledPWA() {
  if ('getInstalledRelatedApps' in window.navigator) {
    try {
      const relatedApps = await navigator.getInstalledRelatedApps();
      if (relatedApps.length > 0) {
        return true;
      }
    } catch (error) {
      return false;
    }
  }
  return false;
}

async function logoLoaderAnimation(installTime = 5000) {
  const buttons = document.querySelectorAll('.install-button');
  const mainHeader = document.querySelector('.main-header');
  const programLogoImg = mainHeader.querySelector('.program-logo img');
  const showbox = mainHeader.querySelector('.showbox');
  const donut = mainHeader.querySelector('.donut');
  const programInfoFirst = mainHeader.querySelector('.program-info-first');
  const programInfoInstal = mainHeader.querySelector('.program-info-instal');
  const programBottom = mainHeader.querySelector('.program__bottom');
  const wait = mainHeader.querySelector('.wait');
  const waitPercent = mainHeader.querySelector('.wait-percent');
  const waitPercentValue = waitPercent.querySelector('.wait-percent__value');
  const donutSegment2 = donut.querySelector('.donut-segment-2');
  const waitInstall = mainHeader.querySelector('.wait-install');
  const loader = showbox.querySelector('.loader');
  const svgItem = mainHeader.querySelector('.svg-item');
  const circularPath = mainHeader.querySelector('.circular > .path');

  const loadingStep = Math.trunc(100 / ((installTime / 1000) * 2));
  let percent = 0;

  buttons.forEach(button => {
    button.classList.add('click-none');
    button.style.background = '#e3e3e3';
  })
  programLogoImg.classList.add('transform');
  showbox.style.opacity = '1';
  donut.style.opacity = '0';
  donut.classList.add('rotate');
  mainHeader.classList.add('collumn');
  programInfoFirst.classList.add('none');
  programInfoInstal.classList.add('open');
  programBottom.classList.remove('none');

  await asyncTimeout(() => {
    programBottom.classList.add('none');
    wait.style.display = 'none';
    waitPercent.style.display = 'block';
    svgItem.classList.remove('none');
    loader.style.opacity = '0';
    donut.style.opacity = '1';

    const interval = setInterval(async () => {
      percent += loadingStep;
      waitPercentValue.innerHTML = `${percent}`;
      donutSegment2.style.strokeDasharray = `${percent}, ${100 - percent}`;

      if (percent >= 100 || typeof installerEntity !== 'undefined' && installerEntity.status === 'ready') {
        clearInterval(interval);

        await asyncTimeout(() => {
          waitPercent.style.display = 'none';
          waitInstall.style.display = 'block';
          svgItem.classList.add('none');
          loader.style.opacity = '1';
          circularPath.style.stroke = '#00a173';
        }, 1000);

        let timeout = typeof installerEntity !== 'undefined' && installerEntity.status === 'ready' ? 500 : 5000;

        await asyncTimeout(() => {
          buttons.forEach(button => {
            button.classList.remove('click-none');
            button.style.background = 'var(--c-grean)';
          })
          waitInstall.style.display = 'none';
          programInfoFirst.classList.remove('none');
          programInfoInstal.classList.remove('open');
          loader.style.opacity = '0';
          showbox.style.opacity = '0';
          programBottom.classList.remove('none');
          programLogoImg.classList.remove('transform');
        }, timeout);
      }
    }, 500);
  }, 5000);
}

const setTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('theme-dark')
  } else {
    document.body.classList.add('theme-light')
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (event.matches) {
      document.body.classList.remove('theme-light')
      document.body.classList.add('theme-dark')
    } else {
      document.body.classList.remove('theme-dark')
      document.body.classList.add('theme-light')
    }
  });
}

document.querySelectorAll('.review__text').forEach((elem) => {
  elem.addEventListener('click', () => {
    elem.classList.toggle('webkit');
  });
});

window.addEventListener('DOMContentLoaded', async () => {
  buttonInstallLoader = document.querySelectorAll('.install-button__loader');
  buttonInstallText = document.querySelectorAll('.install-button__text');
  fakeButtonLoaders = document.querySelectorAll('.loader-percent__value');
  installButtonType = document.body.getAttribute('data-button-type');
  matchTheme = JSON.parse(document.body.getAttribute('data-match-theme'));
  pwaInstalled = await isInstalledPWA()

  if (matchTheme) {
    setTheme()
  }

  if (pwaInstalled) return

  if (installButtonType && installButtonType === 'logoLoader') {
    await logoLoaderAnimation(20000)
  } else if(installButtonType) {
    showButtonInstallLoader();

    setTimeout(() => {
      hideButtonInstallLoader();
    }, 10000);
  }

  if (fakeButtonLoaders) {
    fakeButtonLoading();
  }
});
