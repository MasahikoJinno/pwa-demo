import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { withStyles } from 'material-ui/styles';
import red from 'material-ui/colors/red';
import gerNewStories from './getNewStories';

import AppBar from './AppBar';
import StoryList from './StoryList';
import PromotionModal from './PromotionModal';

const EVENT_BEFORE_INSTALL_PROMPT = 'beforeinstallprompt';

const theme = createMuiTheme({
  palette: {
    primary: red,
  },
});

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

  componentWillUnmount() {
    window.removeEventListener(EVENT_BEFORE_INSTALL_PROMPT, this._stopBannerDisplay);
    window.removeEventListener(EVENT_BEFORE_INSTALL_PROMPT, this._loggingShowPrompt);
    window.removeEventListener(EVENT_BEFORE_INSTALL_PROMPT, this._deferredPrompt);
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
    window.addEventListener(EVENT_BEFORE_INSTALL_PROMPT, this._stopBannerDisplay);
  };

  loggingShowPrompt = () => {
    window.addEventListener(EVENT_BEFORE_INSTALL_PROMPT, this._loggingShowPrompt);
  };

  deferredPrompt = () => {
    window.addEventListener(EVENT_BEFORE_INSTALL_PROMPT, this._deferredPrompt);
  };

  _stopBannerDisplay = e => {
    console.log('Stop banner display');
    e.preventDefault();
    return false;
  };

  _loggingShowPrompt = e => {
    e.userChoice.then(choiceResult => {
      console.log(choiceResult.outcome);
      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled.');
      } else {
        console.log('User added.');
      }
    });
  };

  _deferredPrompt = e => {
    e.preventDefault();
    this.setState({ e });
    this.handleOpen();  // 事前訴求モーダルを表示
    return false;
  };

  render() {
    const {
      classes,
    } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <AppBar />
        <StoryList stories={this.state.stories} />
        <PromotionModal
          open={this.state.open}
          classMedia={classes.media}
          classCard={classes.card}
          handleClose={this.handleClose}
          handleAddClick={this.handleAddClick}
        />
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);