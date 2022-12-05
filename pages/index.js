import SearchIcon from "@mui/icons-material/Search";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "../src/Link";

const Home = ({ highlyRatedBooks, mostReviewedBooks }) => {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");

  const handleTextChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && keyword) {
      router.push({
        pathname: "/books",
        query: { keyword },
      });
    }
  };

  return (
    <>
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
        <Typography variant="h6" sx={{ mt: 3 }}>
          評価が高い本
        </Typography>
        <Box sx={{ mt: 1, overflow: "auto", whiteSpace: "nowrap" }}>
          {highlyRatedBooks.map((book) => (
            <Box key={book.isbn} sx={{ mr: 3, my: 1, display: "inline-block" }}>
              <Link href={`/books/${book.isbn}`}>
                <Box
                  component="img"
                  src={book.img}
                  sx={{
                    width: 128,
                    height: 176,
                    border: 1,
                    borderColor: "grey.400",
                    "&:hover": { opacity: 0.7 },
                  }}
                />
              </Link>
            </Box>
          ))}
        </Box>
        <Typography variant="h6" sx={{ mt: 3 }}>
          レビュー数が多い本
        </Typography>
        <Box sx={{ mt: 1, mb: 2, overflow: "auto", whiteSpace: "nowrap" }}>
          {mostReviewedBooks.map((book) => (
            <Box key={book.isbn} sx={{ mr: 3, my: 1, display: "inline-block" }}>
              <Link href={`/books/${book.isbn}`}>
                <Box
                  component="img"
                  src={book.img}
                  sx={{
                    width: 128,
                    height: 176,
                    border: 1,
                    borderColor: "grey.400",
                    "&:hover": { opacity: 0.7 },
                  }}
                />
              </Link>
            </Box>
          ))}
        </Box>
      </Container>
      <Toolbar />
      <AppBar color="inherit" position="fixed" sx={{ top: "auto", bottom: 0 }}>
        <Toolbar>
          {/* eslint-disable-next-line react/jsx-no-target-blank */}
          <a href="https://webservice.rakuten.co.jp/" target="_blank">
            <img
              src="https://webservice.rakuten.co.jp/img/credit/200709/credit_31130.gif"
              border="0"
              alt="Rakuten Web Service Center"
              title="Rakuten Web Service Center"
              width="311"
              height="30"
            />
          </a>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Home;

export const getServerSideProps = async () => {
  let highlyRatedBooks;
  let mostReviewedBooks;

  try {
    const responses = await Promise.all([
      axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/highly-rated-books`,
        { params: { topn: 10 } }
      ),
      axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/most-reviewed-books`,
        { params: { topn: 10 } }
      ),
    ]);
    highlyRatedBooks = responses[0].data.books;
    mostReviewedBooks = responses[1].data.books;
  } catch {
    highlyRatedBooks = [];
    mostReviewedBooks = [];
  }

  return { props: { highlyRatedBooks, mostReviewedBooks } };
};
