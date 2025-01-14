import styled from "styled-components";

export const Container = styled.div`
  height: calc(100vh - 100px);
  width: 100%;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  * {
    font-size: 14px;
  }
  @media screen and (min-width: 100px) and (max-width: 1200px) {
    * {
      font-size: 11px;
    }
  }

  @media screen and (min-width: 1200px) and (max-width: 1500px) {
    * {
      font-size: 12px;
    }
  }
  .ant-timeline-item-tail {
    border-color: #00a650;
  }
  .ant-timeline-item-head-custom {
    padding-block: 0;
  }
`;
export const Style = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  .ant-table-row {
    &.custom .ant-table-cell-row-hover {
      background: unset;
    }
  }
  .ant-tabs-content {
    height: 100%;
  }
`;
