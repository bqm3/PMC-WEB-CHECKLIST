import serve from 'serve';

const options = {
    port: 3000,
    directory: './build', // Thư mục build của React
};

serve(options);
