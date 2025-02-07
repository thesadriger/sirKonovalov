import { exec } from 'child_process';
import path from 'path';
import { readdir } from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VIDEOS_DIR = path.join(__dirname, '../public/videos');
const QUALITY = '2000k';

// Проверка наличия FFmpeg
const checkFFmpeg = () => {
  return new Promise((resolve, reject) => {
    exec('ffmpeg -version', (error) => {
      if (error) {
        reject('FFmpeg не установлен. Установите его через brew install ffmpeg');
      } else {
        resolve();
      }
    });
  });
};

const optimizeVideo = (inputFile) => {
  const baseName = path.basename(inputFile, '.mp4');
  const webmOutput = path.join(VIDEOS_DIR, `${baseName}.webm`);
  const mp4Output = path.join(VIDEOS_DIR, `${baseName}_optimized.mp4`);

  // WebM конвертация
  exec(`ffmpeg -i ${inputFile} -c:v libvpx-vp9 -b:v ${QUALITY} -c:a libopus ${webmOutput}`, 
    (error) => {
      if (error) {
        console.error(`Ошибка при создании WebM: ${error}`);
        return;
      }
      console.log(`WebM создан: ${webmOutput}`);
    }
  );

  // MP4 оптимизация
  exec(`ffmpeg -i ${inputFile} -vcodec h264 -profile:v main -preset slow -b:v ${QUALITY} ${mp4Output}`,
    (error) => {
      if (error) {
        console.error(`Ошибка при оптимизации MP4: ${error}`);
        return;
      }
      console.log(`MP4 оптимизирован: ${mp4Output}`);
    }
  );
};

async function main() {
  try {
    await checkFFmpeg();
    const files = await readdir(VIDEOS_DIR);
    
    files
      .filter(file => file.endsWith('.mp4') && !file.includes('_optimized'))
      .forEach(file => {
        optimizeVideo(path.join(VIDEOS_DIR, file));
      });
  } catch (err) {
    console.error('Ошибка чтения директории:', err);
    process.exit(1);
  }
}

main(); // Запускаем основную функцию 