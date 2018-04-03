import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { withStyles } from 'material-ui/styles';
import red from 'material-ui/colors/red';
import gerNewStories from './getNewStories';

import AppBar from './AppBar';
import StoryList from './StoryList';
import Modal from 'material-ui/Modal';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';

const theme = createMuiTheme({
  palette: {
    primary: red,
  },
});

function getModalStyle() {
  const top = 25;
  const left = 0;

  return {
    top: `${top}%`,
    left: `${left}%`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
  card: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    maxWidth: 345,
  },
  media: {
    height: 200,
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stories: [],
      e: {},
      open: false, // Modalの表示
      isBannerShow: true,  // trueだと事前訴求を行う
      isPromptShow: true, // trueだとApp Install Bannerが表示される
    };
  }

  componentDidMount() {
    gerNewStories().then(data => {
      this.setState({
        stories: data,
      })
    });
    if (!this.state.isPromptShow) {
      this.stopShowPrompt();  // App Install Bannerを表示しない
    } else {
      if (this.state.isBannerShow) {
        this.deferredPrompt(); // 事前訴求を行う
      } else {
        this.loggingShowPrompt(); // 事前訴求無し
      }
    }
  }

  handleAddClick = () => {
    if (this.state.e !== undefined) {
      const e = this.state.e;
      e.prompt();
      e.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'dismissed') {
          console.log('User cancelled');
        } else {
          console.log('User added');
        }
        this.setState({ e: null });
      });
    }
    this.handleClose(); // 事前訴求モーダルを閉じる
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  stopShowPrompt = () => {
    window.addEventListener('beforeinstallprompt', e => {
      console.log('Stop banner display');
      e.preventDefault();
      return false;
    });
  };

  loggingShowPrompt = () => {
    window.addEventListener('beforeinstallprompt', e => {
      e.userChoice.then(choiceResult => {
        console.log(choiceResult.outcome);
        if (choiceResult.outcome === 'dismissed') {
          console.log('User cancelled.');
        } else {
          console.log('User added.');
        }
      });
    });
  };

  deferredPrompt = () => {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      this.setState({ e });
      this.handleOpen();  // 事前訴求モーダルを表示
      return false;
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <AppBar />
        <StoryList stories={this.state.stories} />
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <Card style={getModalStyle()} className={classes.card}>
            <CardMedia
              className={classes.media}
              image="/serval.jpg"
              title="Serval"
            />
            <CardContent>
              <Typography gutterBottom variant="headline" component="h2">
                A2HSテスト
              </Typography>
              <Typography component="p">
                ホーム画面追加するととてもいいことあるよ！
              </Typography>
            </CardContent>
            <CardActions>
              <Button onClick={this.handleClose} size="small" color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleAddClick} size="small" color="primary">
                Add to homescreen!
              </Button>
            </CardActions>
          </Card>
        </Modal>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);