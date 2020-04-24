
export const onGridLayoutChange = (gridLayout, setLayout) => {
    setLayout( prevState => {
      return {
        ...prevState,
        gridLayout: gridLayout
      }
    });
  };

export const onRemoveCell = (cellCode, layout, setLayout) => {
    const newGridLayout = [...layout.gridLayout];
    const newGridContent = [...layout.gridContent];
    newGridLayout.splice(newGridLayout.findIndex(c => c.i === cellCode), 1);
    newGridContent.splice(newGridContent.findIndex(c => c.i === cellCode), 1);
    setLayout({
      ...layout,
      gridLayout: newGridLayout,
      gridContent: newGridContent
    });
  };
