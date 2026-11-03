        * {
            box-sizing: border-box;
        }
        html,
        body {
            max-width: 100%;
        }
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            overflow-wrap: break-word;
            word-wrap: break-word;
        }
        img {
            max-width: 100%;
        }
        table {
            max-width: 100%;
        }
        thead {
            display: table-header-group;
        }
        tfoot {
            display: table-row-group;
        }
        tr {
            page-break-inside: avoid;
        }
        th,
        td {
            overflow-wrap: break-word;
            word-wrap: break-word;
        }
        .data-table,
        .breakdown-table,
        .emp-table,
        .employee {
            width: 100%;
            table-layout: fixed;
        }
        .num-col,
        .amt-col,
        .amount {
            text-align: right;
            font-variant-numeric: tabular-nums;
        }
