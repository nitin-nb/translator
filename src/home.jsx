import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import bg from "./Assets/hero_img.jpg";
import logo from "./Assets/logo.svg";
import hIcon from "./Assets/Horizontal_top_left_main.svg";
import speakerIcon from "./Assets/sound_max_fill.svg";
import copyIcon from "./Assets/Copy.svg";
import translateIcon from "./Assets/Sort_alfa.svg";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function Home() {
  const styles = {
    buttons: {
      fontSize: "0.875rem",
      fontWeight: 700,
      color: "#4D5562",
      textTransform: "initial",
    },
    activeButton: {
      fontSize: "0.875rem",
      fontWeight: 700,
      backgroundColor: "#394150",
      color: "#fff",
      textTransform: "initial",
      borderRadius: 3,
    },
    select: {
      fontSize: "0.875rem",
      fontWeight: 700,
      color: "#4D5562",
      textTransform: "initial",
    },
  };

  const [language, setLanguage] = useState("en");
  const [transLanguage, setTransLanguage] = useState("fr");
  const [textFrom, setTextFrom] = useState("");
  const [resultText, setResultText] = useState("");
  const [loader, setLoader] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [action, setAction] = useState(false);
  const [lang, setLang] = useState([]); // Initialize with an empty array

  const textFieldRef = useRef(null);

  const handleOnChange = (e) => {
    const textData = e.target.value;
    setTextFrom(textData);
  };

  const handleLanguageChange1 = (event) => {
    const selectedCode1 = event.target.value;
    setLanguage(selectedCode1);
  };

  const handleLanguageChange2 = (event) => {
    const selectedCode2 = event.target.value;
    setTransLanguage(selectedCode2);
  };

  const handleSubmit = async () => {
    setLoader(true);
    try {
      let data = textFrom;
      let fromLang = language;
      let toLang = transLanguage;

      let response = await axios.get(
        `https://api.mymemory.translated.net/get?q=${data}&langpair=${fromLang}|${toLang}`
      );
      const result = response.data.responseData.translatedText;
      setResultText(result);
    } catch (err) {
      console.log("err", err);
    }
    setLoader(false);
  };

  const getLanguages = async () => {
    try {
      let result = await axios.get("https://restcountries.com/v3.1/all");
      const languages = {};

      // Iterate through the countries to extract languages
      result.data.forEach((country) => {
        if (country.languages) {
          Object.entries(country.languages).forEach(([code, name]) => {
            if (!languages[code]) {
              languages[code] = name;
            }
          });
        }
      });

      // Convert languages object to an array
      const languageList = Object.entries(languages).map(([code, name]) => ({
        code,
        name,
      }));
      setLang(languageList);

      console.log(languageList, "result");
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSwitch = () => {
    let tempLang = language;
    let textSet = textFrom;
    setLanguage(transLanguage);
    setTransLanguage(tempLang);
    setTextFrom(resultText);
    setResultText(textSet);
  };

  const handleCopy = (id) => {
    navigator.clipboard
      .writeText(id)
      .then(() => {
        setAction(true);
        setToastOpen(true);
      })
      .catch((err) => {
        setAction(false);
        setToastOpen(true);
        console.error("Error in copying text: ", err);
      });
  };

  const handleClose = () => {
    setToastOpen(false);
  };

  const handleCopyToResult = () => {
    setResultText(textFieldRef.current.value);
    handleCopy(resultText);
  };

  const handleCopyToTextField = () => {
    setTextFrom(resultText);
    handleCopy(textFrom);
  };

  useEffect(() => {
    getLanguages();
  }, []);

  return (
    <Box
      sx={{
        backgroundImage: `url(${bg})`,
        backgroundRepeat: "no-repeat",
        minHeight: "81.8vh",
        backgroundSize: "cover",
        padding: 10,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <img src={logo} alt="logo" height={"50px"} />
      </Box>
      <Grid container gap={4} justifyContent="center">
        <Grid
          item
          xs={12}
          md={5.8}
          sx={{
            backgroundColor: "#212936cc",
            border: "1px solid #4D5562",
            borderRadius: "15px",
            padding: 3,
            paddingTop: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "#4D5562",
              gap: 3,
              padding: 2,
              paddingBottom: 1,
            }}
            m={1}
          >
            {/* <Typography sx={styles.buttons}>Detected Language</Typography> */}
            <Button
              sx={language === "en" ? styles.activeButton : styles.buttons}
              onClick={() => setLanguage("en")}
            >
              English
            </Button>
            <Button
              sx={language === "fr" ? styles.activeButton : styles.buttons}
              onClick={() => setLanguage("fr")}
            >
              French
            </Button>
            <TextField
                id="lang"
                select
                value={language}
                onChange={handleLanguageChange1}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: {...styles.activeButton}
                }}
                SelectProps={{
                  sx: {...styles.activeButton,
                    padding: 1,
                    ".MuiSelect-icon": {
                      color: "white",
                    },
                  },
                }}
              ><MenuItem >Select</MenuItem>
                {lang.map((option) => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
          </Box>
          <Box
            sx={{
              borderTop: "1px solid #4D5562",
              marginLeft: 0,
              marginRight: 0,
              marginTop: 0,
            }}
            m={2}
          />
          <Box sx={{ minHeight: "20vh" }}>
            <TextField
              variant="standard"
              required
              fullWidth
              multiline
              autoFocus
              placeholder="Enter your text"
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: "1rem",
                  color: "white",
                  fontWeight: 700,
                  borderRadius: 1,
                },
              }}
              value={textFrom}
              spellCheck={false}
              inputRef={textFieldRef}
              onChange={handleOnChange}
            />
          </Box>
          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            alignItems={"center"}
            p={2}
            pb={0}
          >
            <Typography
              sx={{ fontSize: "0.85rem", fontWeight: 500, color: "#CDD5E0" }}
            >
              {textFrom.length}/500
            </Typography>
          </Box>
          <Box
            p={2}
            paddingLeft={0}
            paddingBottom={0}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={2}
          >
            <Box display={"flex"} alignItems={"center"} gap={2}>
              <Button
                sx={{
                  border: "2px solid #4D5562",
                  padding: 0.5,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  minWidth: "20px",
                }}
              >
                <img src={speakerIcon} alt="icon" style={{ height: "20px" }} />
              </Button>
              <Button
                sx={{
                  border: "2px solid #4D5562",
                  padding: 0.5,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  minWidth: "20px",
                }}
                id="text"
                onClick={() => handleCopyToTextField()}
              >
                <img src={copyIcon} alt="icon" style={{ height: "20px" }} />
              </Button>
            </Box>
            <Button
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #7CA9F3",
                padding: 1,
                px: 3,
                borderRadius: 3,
                backgroundColor: "#3662E3",
                fontSize: "1rem",
                fontWeight: 700,
                color: "white",
              }}
              onClick={handleSubmit}
            >
              <img
                src={translateIcon}
                alt="translate"
                style={{ height: "30px" }}
              />
              Translate
            </Button>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={5.8}
          sx={{
            backgroundColor: "#121826cc",
            border: "1px solid #4D5562",
            borderRadius: "15px",
            padding: 3,
            paddingTop: 0,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "#4D5562",
                gap: 3,
                padding: 2,
                paddingBottom: 1,
              }}
              m={1}
            >
              <Button
                sx={
                  transLanguage === "en" ? styles.activeButton : styles.buttons
                }
                onClick={() => setTransLanguage("en")}
              >
                English
              </Button>
              <Button
                sx={
                  transLanguage === "fr" ? styles.activeButton : styles.buttons
                }
                onClick={() => setTransLanguage("fr")}
              >
                French
              </Button>
              <TextField
                id="setLang"
                select
                value={transLanguage}
                onChange={handleLanguageChange2}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: {...styles.activeButton}
                }}
                SelectProps={{
                  sx: {...styles.activeButton,
                    padding: 1,
                    ".MuiSelect-icon": {
                      color: "white",
                    },
                  },
                }}
              >
                {lang.map((option) => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"flex-end"}
              alignItems={"center"}
            >
              <Button
                sx={{
                  border: "2px solid #4D5562",
                  padding: 0.5,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  minWidth: "20px",
                }}
                onClick={handleSwitch}
              >
                <img src={hIcon} alt="icon" style={{ height: "18px" }} />
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              borderTop: "1px solid #4D5562",
              marginLeft: 0,
              marginRight: 0,
              marginTop: 0,
            }}
            m={2}
          />
          {loader === true ? (
            <Box
              sx={{
                minHeight: "25vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress size={80} sx={{ zIndex: 999 }} />
            </Box>
          ) : (
            <Box sx={{ minHeight: "25vh" }}>
              <Typography
                sx={{
                  fontSize: "1rem",
                  color: "white",
                  fontWeight: 700,
                  borderRadius: 1,
                }}
              >
                {textFrom.length > 0 ? resultText : "Enter the text to translate"}
              </Typography>
            </Box>
          )}
          <Box
            p={2}
            paddingLeft={0}
            paddingBottom={0}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={2}
          >
            <Box display={"flex"} alignItems={"center"} gap={2}>
              <Button
                sx={{
                  border: "2px solid #4D5562",
                  padding: 0.5,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  minWidth: "20px",
                }}
              >
                <img src={speakerIcon} alt="icon" style={{ height: "20px" }} />
              </Button>
              <Button
                sx={{
                  border: "2px solid #4D5562",
                  padding: 0.5,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  minWidth: "20px",
                }}
                id="result"
                onClick={() => handleCopyToResult()}
              >
                <img src={copyIcon} alt="icon" style={{ height: "20px" }} />
              </Button>
            </Box>
          </Box>
          <Snackbar
            open={toastOpen}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleClose}
              severity={action === true ? "success" : "danger"}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {action === true ? "Text copied to clipboard" : "Error occurred"}
            </Alert>
          </Snackbar>
        </Grid>
      </Grid>
    </Box>
  );
}
