const fs = require('fs');
const {Client} = require('pg');

const client = new Client({
    host: '127.0.0.1',
    user: 'brontosaur',
    database: 'dbMDS',
    password: '1234',
    port: 5432
});

const createTableUserQuery = fs.readFileSync('sql/users.sql', 'utf8');
const createTableProfileQuery = fs.readFileSync('sql/profiles.sql', 'utf8');
const createTablePotsQuery = fs.readFileSync('sql/posts.sql', 'utf8');
const createTablePotLikesQuery = fs.readFileSync('sql/postLikes.sql', 'utf8');
const createTableCommentsQuery = fs.readFileSync('sql/comments.sql', 'utf8');
const createTableCommentLikesQuery = fs.readFileSync('sql/commentLikes.sql', 'utf8');
const createTableFollowersQuery = fs.readFileSync('sql/followers.sql', 'utf8');
const createTableNotificationTypeQuery = fs.readFileSync('sql/notification-type.sql', 'utf8');
const createTableNotifications = fs.readFileSync('sql/notifications.sql', 'utf8');
const createTableNotificationRecipientsQuery = fs.readFileSync('sql/notification-recipients.sql', 'utf8');
const createTableChatsQuery = fs.readFileSync('sql/chats.sql', 'utf8');
const createTableChatUsersQuery = fs.readFileSync('sql/chatsUsers.sql', 'utf8');
const createTableChatMessagesQuery = fs.readFileSync('sql/chatMessages.sql', 'utf8');


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