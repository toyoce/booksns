import SearchIcon from '@mui/icons-material/Search';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/router';
import { useState } from 'react';


const BooksPage = () => {
  const router = useRouter();

  const [keyword, setKeyword] = useState(router.query.keyword);

  const handleTextChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      alert("Enter was clicked");
    }
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
        value={keyword}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
      />
    </Container>
  );
};

export default BooksPage;