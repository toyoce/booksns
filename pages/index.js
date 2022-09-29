import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import Link from '../src/Link';

const Home = () => {
  const [title, setTitle] = useState('');

  const handleTextChange = (event) => {
    setTitle(event.target.value);
  };

  return (
    <Container>
      <TextField
        fullWidth
        placeholder="気になる本のタイトルを入力してください"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mt: 3 }}
        variant="outlined"
        value={title}
        onChange={handleTextChange}
      />
      <Box mt={2} display="flex" alignItems="center">
        <Typography variant="h6">評価が高い本</Typography>
        <Link
          variant="body2"
          ml={1}
          underline="hover"
          color="text.primary"
          href="/books"
        >
          もっと見る &gt;
        </Link>
      </Box>
    </Container>
  );
};

export default Home;