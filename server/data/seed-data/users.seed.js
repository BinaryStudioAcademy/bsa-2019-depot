const cryptoHelper = require('../../helpers/crypto.helper');

const hash = password => cryptoHelper.encryptSync(password);

const now = new Date();

const usersSeed = [
  {
    email: 'test@test.com',
    username: 'test',
    password: hash('test1111'),
    name: 'Quintana Fullard',
    bio: 'odio porttitor id consequat in consequat ut nulla sed accumsan felis ut at dolor quis odio',
    url: 'https://parallels.com/non.jsp',
    company: 'Agimba',
    location: 'Morocco',
    imgUrl: 'https://i.pravatar.cc/500?u=64225046f6c9da745c42f6b86d79881f',
    type: 'USER',
    fake: false
  },
  {
    email: 'sandrk27@gmail.com',
    username: 'user0',
    password: hash('1234'),
    name: 'Frazier Jakubowsky',
    bio:
      'sit amet consectetuer adipiscing elit proin interdum mauris non ligula pellentesque ultrices phasellus id sapien in sapien iaculis congue vivamus',
    url: 'https://symantec.com/non/velit.aspx',
    company: 'Mydo',
    location: 'Philippines',
    imgUrl: 'https://i.pravatar.cc/500?u=af3744e75a3c3492a262657a56430475',
    type: 'USER',
    fake: false
  },
  {
    email: 'user1@ukr.net',
    username: 'user1',
    password: hash('qwerty'),
    name: 'Nicky Pevreal',
    bio: 'est congue elementum in hac habitasse platea dictumst morbi vestibulum velit id pretium iaculis diam',
    url: 'http://cocolog-nifty.com/ante/vivamus/tortor/duis/mattis.js',
    company: 'Skipstorm',
    location: 'Israel',
    imgUrl: 'https://i.pravatar.cc/500?u=76e51ca8358b445a5ce495b4dd59cd2f',
    type: 'USER',
    fake: false
  },
  {
    email: 'user2@depot.com',
    username: 'user2',
    password: hash('2222'),
    name: 'Jackie Allso',
    bio:
      'hac habitasse platea dictumst aliquam augue quam sollicitudin vitae consectetuer eget rutrum at lorem integer tincidunt ante vel ipsum praesent',
    url: 'http://bizjournals.com/consequat.html',
    company: 'Meedoo',
    location: 'China',
    imgUrl: 'https://i.pravatar.cc/500?u=15b0b0938f3963143d71ba68f077f908',
    type: 'USER',
    fake: false
  },
  {
    email: 'user3@gmail.com',
    username: 'user3',
    password: hash('3333'),
    name: 'Teddy Chestney',
    bio: 'ultrices phasellus id sapien in sapien iaculis congue vivamus metus arcu adipiscing molestie hendrerit',
    url: 'https://studiopress.com/luctus/tincidunt/nulla/mollis/molestie.png',
    company: 'Yambee',
    location: 'Kosovo',
    imgUrl: 'https://i.pravatar.cc/500?u=7f086d5d33e59636cccf61b36026eb96',
    type: 'USER',
    fake: false
  },
  {
    email: 'google@gmail.com',
    username: 'google',
    type: 'ORG',
    fake: false
  },
  {
    email: 'amazon@gmail.com',
    username: 'amazon',
    type: 'ORG',
    fake: false
  },
  {
    email: 'facebook@gmail.com',
    username: 'facebook',
    type: 'ORG',
    fake: false
  }
].map(user => ({
  ...user,
  createdAt: now,
  updatedAt: now
}));

module.exports = usersSeed;
