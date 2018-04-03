import React from 'react';
import List, { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  root: {
    marginTop: 60,
    width: '100%',
    background: theme.palette.background.paper,
  },
});

const StoryList = props => {
  const {
    classes,
    stories,
  } = props;

  const storyList = stories.map((story, index) => {
    const option = (index % 2 === 0) ? '_blank' : '';
    return <List key={'story-' + index} dense={true}>
      <ListItem button>
        <a href={story.url} target={option}>{story.title}</a>
      </ListItem>
      <Divider/>
    </List>;
  });

  return (
    <div className={classes.root}>
      {storyList}
    </div>
  );
};

export default withStyles(styles)(StoryList);
