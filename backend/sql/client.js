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
const createTableChatUsersQuery = fs.readFileSync('sql/chatUsers.sql', 'utf8');
const createTableChatMessagesQuery = fs.readFileSync('sql/chatMessages.sql', 'utf8');


client.connect()
    .then(() => {
        console.log('Connected to the PostgreSQL database');

        // Execute all queries sequentially
        return Promise.all([
            client.query(createTableUserQuery).then(() => console.log('createTableUserQuery created successfully')),
            client.query(createTableProfileQuery).then(() => console.log('createTableProfileQuery created successfully')),
            client.query(createTablePotsQuery).then(() => console.log('createTablePotsQuery created successfully')),
            client.query(createTablePotLikesQuery).then(() => console.log('createTablePotLikesQuery created successfully')),
            client.query(createTableCommentsQuery).then(() => console.log('createTableCommentsQuery created successfully')),
            client.query(createTableCommentLikesQuery).then(() => console.log('createTableCommentLikesQuery created successfully')),
            client.query(createTableFollowersQuery).then(() => console.log('createTableFollowersQuery created successfully')),
            client.query(createTableNotificationTypeQuery).then(() => console.log('createTableNotificationTypeQuery created successfully')),
            client.query(createTableNotifications).then(() => console.log('createTableNotifications created successfully')),
            client.query(createTableNotificationRecipientsQuery).then(() => console.log('createTableNotificationRecipientsQuery created successfully')),
            client.query(createTableChatsQuery).then(() => console.log('createTableChatsQuery created successfully')),
            client.query(createTableChatUsersQuery).then(() => console.log('createTableChatUsersQuery created successfully')),
            client.query(createTableChatMessagesQuery).then(() => console.log('createTableChatMessagesQuery created successfully'))
        ]);
    })
    .then(() => {
        console.log('All queries executed successfully');
    })
    .catch(err => {
        console.error('Error executing queries:', err);
    })
    .finally(() => {
        // Close the connection
        client.end()
            .then(() => {
                console.log('Connection to PostgreSQL closed');
            })
            .catch(err => {
                console.error('Error closing PostgreSQL connection', err);
            });
    });
