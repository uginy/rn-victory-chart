import styled from 'styled-components';

export const StyledWrapper = styled.div`
  display: flex;
  
  .chart_main_inner_wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .chart_legend_wrapper {
    padding: 3.5rem 0;
    min-width: 220px;
  }

  .chart_legend_inner {
    border: 1px solid silver;
    padding: 0.5rem;
    border-radius: 0.2rem;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }

  .chart_legend__time_header {
    white-space: nowrap;
  }

  .chart_legend_label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
  }
`;
