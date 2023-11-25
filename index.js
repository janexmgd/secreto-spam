import axios from 'axios';
import randUserAgent from 'rand-user-agent';
import crypto from 'node:crypto';
import inquirer from 'inquirer';
import ora from 'ora';

const agent = randUserAgent('desktop', 'firefox', 'linux');

const generateMessage = () => {
  try {
    return crypto
      .randomBytes(Math.ceil(100 / 2))
      .toString('hex')
      .slice(0, 100);
  } catch (error) {
    console.log(error);
  }
};

const delay = (ms) => {
  const loading = ora(`Delaying for ${ms / 1000} seconds`).start();

  return new Promise((resolve) => {
    setTimeout(() => {
      loading.succeed('Delay complete');
      resolve();
    }, ms);
  });
};
const sendMessage = async (userId, message, index) => {
  try {
    const loading = ora(`Sending message ${index}`).start();
    const logging = `{\n   "status": "success",\n   "target":"${userId}",\n   "message": "${message}",\n   "count": ${index}\n  }`;
    await axios.post(
      'https://api.secreto.site/sendmsg',
      {
        id: `${userId}`,
        message: `${message}`,
      },
      {
        headers: {
          'User-Agent': agent,
        },
      }
    );
    loading.succeed(logging);
  } catch (error) {
    console.log(`${error}`);
  }
};
(async () => {
  try {
    const question = await inquirer.prompt([
      {
        type: 'input',
        name: 'count',
        message: 'how many count of spam secreto ?',
      },
      {
        type: 'input',
        name: 'userId',
        message: 'what id of secreto user\n  example 12290513_7bff5 ?',
      },
    ]);
    const { count, userId } = question;
    const listMesssage = [];
    for (let index = 1; index <= count; index++) {
      const message = generateMessage();
      listMesssage.push(message);
    }
    const tasks = [];
    for (let index = 1; index <= count; index++) {
      tasks.push(sendMessage(userId, listMesssage[index - 1], index));
      await delay(1500);
    }
    await Promise.all(tasks);
    console.log(`success spam ${count} message to secreto`);
  } catch (error) {
    console.log(error);
  }
})();
