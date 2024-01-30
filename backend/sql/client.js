const fs = require('fs');
const {Client} = require('pg');

const client = new Client({
    host: '127.0.0.1',
    user: 'brontosaur',
    database: 'dbMDS',
    password: '1234',
    port: 5432
});

const createTableUserQuery = fs.readFileSync('users.sql', 'utf8');
const createTableProfileQuery = fs.readFileSync('profiles.sql', 'utf8');
const createTablePotsQuery = fs.readFileSync('posts.sql', 'utf8');
const createTablePotLikesQuery = fs.readFileSync('postLikes.sql', 'utf8');
const createTableCommentsQuery = fs.readFileSync('comments.sql', 'utf8');
const createTableCommentLikesQuery = fs.readFileSync('commentLikes.sql', 'utf8');
const createTableFollowersQuery = fs.readFileSync('followers.sql', 'utf8');
const createTableNotificationTypeQuery = fs.readFileSync('notification-type.sql', 'utf8');
const createTableNotifications = fs.readFileSync('notifications.sql', 'utf8');
const createTableNotificationRecipientsQuery = fs.readFileSync('notification-recipients.sql', 'utf8');
const createTableChatsQuery = fs.readFileSync('chats.sql', 'utf8');
const createTableChatUsersQuery = fs.readFileSync('chatsUsers.sql', 'utf8');
const createTableChatMessagesQuery = fs.readFileSync('chatMessages.sql', 'utf8');


client.connect()
    .then(() => {
        console.log('Connected to the PostgreSQL database');

        client.query(createTableUserQuery, (err, res) => {
            if (err) {
                console.error('Error creating DB', err);
            } else {
                console.log('createTableUserQuery create successfully');
            }
        });

        return client.end();
    })
    .then(() => {
        console.log('Connection to PostgreSQL closed');
    })
    .catch(err => {
        console.error('Error connecting to PostgreSQL database', err);
    });