import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Table, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
export default class AntDFDATable extends Component {

  state = {
    searchText: '',
    searchedColumn: '',
    filteredInfo: null,
    sortedInfo: null,
    record: {},
    show: false
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  //Start AntD Filters Code//

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  clearFilters = () => {
    this.setState({ filteredInfo: null });
  };

  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    });
  };
  //END AntD Filters Code//


  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    // FilterProducts = [],
    // FilterCompany = [],
    // FilterProductCodes = [];

    const columns = [
      {
        title: 'Name',
        dataIndex: 'Product',
        width: 200,
        // defaultSortOrder: 'descend',
        sorter: (a, b) => {
          if (a.Product < b.Product) { return -1; }
          if (a.Product > b.Product) { return 1; }
          return 0;
        },
        sortDirections: ['descend', 'ascend'],
        ...this.getColumnSearchProps('Product'),
        render: (text, record) => {
          return <a target='_blank' rel="noopener noreferrer" href={"/ProductDetails/" + record.PID}><Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={this.state.searchedColumn === 'Product' ? [this.props.SearchText, this.state.searchText] : [this.props.SearchText] }
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          /></a>
        }
      },
      {
        title: 'Company',
        dataIndex: 'Company',
        width: 200,
        sorter: (a, b) => {
          if (a.Company < b.Company) { return -1; }
          if (a.Company > b.Company) { return 1; }
          return 0;
        },
        sortDirections: ['descend', 'ascend'],
        filters: [...this.props.Filters.Manufacturer.map(m=>{return{text:m.label,value:m.value}}).sort((a, b) => (a.value > b.value) ? 1 : -1)],
        filteredValue: filteredInfo.Company || null,
        onFilter: (value, record) => record["Company"].includes(value),
        // ...this.getColumnSearchProps('Company'),
        render: (text, record) => {
          return <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={this.state.searchedColumn === 'Company' ? [this.props.SearchText, this.state.searchText] : [this.props.SearchText] }
            autoEscape
            textToHighlight={text ? text.toString() : ''}

          />
        }
      },
      // {
      //   title: 'Product Code',
      //   dataIndex: 'Product Code',
      //   sorter: (a, b) => {
      //     if (a["Product Code"] < b["Product Code"]) { return -1; }
      //     if (a["Product Code"] > b["Product Code"]) { return 1; }
      //     return 0;
      //   },
      //   sortDirections: ['descend', 'ascend'],
      //   // filters: [
      //   //   { text: 'Joe', value: 'Joe' },
      //   //   { text: 'Jim', value: 'Jim' },
      //   // ],
      //   // filteredValue: filteredInfo['Product Code'] || null,
      //   // onFilter: (value, record) => record['Product Code'].includes(value),
      //   ...this.getColumnSearchProps('Product Code'),
      // },
      {
        title: 'Body Area',
        dataIndex: 'Body Area',
        width: 200,
        sorter: (a, b) => {
          if (a["Body Area"].length < b["Body Area"].length) { return -1; }
          if (a["Body Area"].length > b["Body Area"].length) { return 1; }
          return 0;
        },
        sortDirections: ['descend', 'ascend'],
        // filters: [...this.props.Filters.BodyArea.map(m=>{return{text:m.label,value:m.value}})],
        // filteredValue: filteredInfo['Body Area'] || null,
        // onFilter: (value, record) => record['Body Area'].includes(value),
        ...this.getColumnSearchProps('Body Area'),
        render: (text, record) => {
          return <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={this.state.searchedColumn === 'Body Area' ? [this.props.SearchText, this.state.searchText] : [this.props.SearchText] }
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        }
      },
      {
        title: 'Modality',
        dataIndex: 'Modality',
        width: 200,
        sorter: (a, b) => {
          if (a.Modality > b.Modality) { return -1; }
          if (a.Modality < b.Modality) { return 1; }
          return 0;
        },
        // sortDirections: ['descend', 'ascend'],
        // filters: [...this.props.Filters.Modality.map(m=>{return{text:m.label,value:m.value}})],
        // filteredValue: filteredInfo["Modality"] || null,
        // onFilter: (value, record) => record["Modality"].includes(value),
        ...this.getColumnSearchProps('Modality'),
        render: (text, record) => {
          return <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={this.state.searchedColumn === 'Modality' ? [this.props.SearchText, this.state.searchText] : [this.props.SearchText] }
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        }
      },
      {
        title: 'Date Cleared',
        dataIndex: 'DateCleared',
        width: 200,
        sorter: (a, b) => {
          if (a["DateCleared"] > b["DateCleared"]) { return -1; }
          if (a["DateCleared"] < b["DateCleared"]) { return 1; }
        },
        sortDirections: ['descend', 'ascend'],
        
        ...this.getColumnSearchProps('DateCleared'),
        render: (text, record) => {
          return <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={this.state.searchedColumn === 'DateCleared' ? [this.props.SearchText, this.state.searchText] : [this.props.SearchText] }
            autoEscape
            textToHighlight={text ? (text) : ''}
          />
        }
      },
      {
        title: 'Download FDA Letter',
        dataIndex: 'FDA Link',
        width: 200,
        render: (text, record) => <a className='pdf-link' target='_blank' rel="noopener noreferrer" href={text}><i className="pdf-icon"></i><span>FDA Letter</span></a>,
      },
    ];

    return (
      <div>
        <Table columns={columns} showSorterTooltip={false} rowKey="Product" pagination={false} dataSource={this.props.FDAList} scroll={{ x: 800, y: 300 }} onChange={this.handleChange} />
      </div>
    );
  }
}