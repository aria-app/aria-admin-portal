import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import clamp from 'lodash/clamp';
import PropTypes from 'prop-types';
import React from 'react';

export default function Pagination(props) {
  const {
    currentPage,
    itemsPerPage,
    onCurrentPageChange,
    totalItemCount,
  } = props;
  const pageCount = React.useMemo(
    () => (totalItemCount ? Math.ceil(totalItemCount / itemsPerPage) : 1),
    [itemsPerPage, totalItemCount],
  );

  const handleNextButtonClick = React.useCallback(() => {
    onCurrentPageChange(currentPage + 1);
  }, [currentPage, onCurrentPageChange]);

  const handlePreviousButtonClick = React.useCallback(() => {
    onCurrentPageChange(currentPage - 1);
  }, [currentPage, onCurrentPageChange]);

  const showing = React.useMemo(() => {
    const pageStart = clamp(
      (currentPage - 1) * itemsPerPage + 1,
      1,
      totalItemCount,
    );
    const pageEnd = clamp(pageStart + itemsPerPage - 1, 1, totalItemCount);

    return totalItemCount
      ? `Showing ${pageStart} - ${pageEnd} of ${totalItemCount} items`
      : `Showing ${totalItemCount} items`;
  }, [currentPage, itemsPerPage, totalItemCount]);

  if (pageCount === 1) {
    return null;
  }

  return (
    <Box alignItems="center" display="flex">
      <IconButton
        disabled={currentPage === 1}
        edge="start"
        onClick={handlePreviousButtonClick}
      >
        <ChevronLeftIcon color="inherit" />
      </IconButton>
      <Typography>
        Page {currentPage} / {pageCount}
      </Typography>
      <IconButton
        disabled={currentPage >= pageCount}
        edge="end"
        onClick={handleNextButtonClick}
      >
        <ChevronRightIcon color="inherit" />
      </IconButton>
      <Box paddingLeft={3}>
        <Typography color="textSecondary">{showing}</Typography>
      </Box>
    </Box>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number,
  itemsPerPage: PropTypes.number,
  onCurrentPageChange: PropTypes.func,
  totalItemCount: PropTypes.number,
};
