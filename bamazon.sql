CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE Products (
    ItemID INTEGER(11) AUTO_INCREMENT NOT NULL,
    ProductName VARCHAR(50) NOT NULL,
    DepartmentName VARCHAR(50) NOT NULL,
    Price FLOAT(7, 2) NOT NULL,
    StockQuantity INTEGER(7) NOT NULL,
    PRIMARY KEY (ItemID)
);

INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ('KitchenAid Mixer', 'Home', 314.99, 50);

INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ('Amazon Fire TV', 'Electronics', 89.99, 200);

INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ('Samsung 50-inch 1080p Smart LED TV', 'Electronics', 479.00, 25);

INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ('LEGO BATMAN MOVIE Batmobile Kit', 'Toys and Games', 139.95, 10);

INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ('Cards Against Humanity Game Set', 'Toys and Games', 29.99, 40);

INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ('Bic Round Medium Point Pens 35-Count', 'Office Supplies', 4.00, 400);

INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ('Five Star Flex Black NoteBinder', 'Office Supplies', 15.77, 200);

INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ('Kershaw 1990X Brawler', 'Sports & Outdoors', 21.88, 60);

INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ('Martini Golf Plastic Tees 5-Pack', 'Sports & Outdoors', 7.37, 230);

INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ('My Little Pony Aluminum Cake Pan', 'Home', 15.25, 15);

CREATE TABLE Departments (
    DepartmentID INTEGER(11) AUTO_INCREMENT NOT NULL,
    DepartmentName VARCHAR(50) NOT NULL,
    OverHeadCosts FLOAT(7, 2) NOT NULL,
    TotalSales FLOAT(7, 2) NOT NULL,
    PRIMARY KEY (DepartmentID)
);

INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales)
VALUES ('Electronics', 12000, 0);

INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales)
VALUES ('Sports & Outdoors', 300, 0);

INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales)
VALUES ('Toys and Games', 1400, 0);

INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales)
VALUES ('Office Supplies', 300, 0);

INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales)
VALUES ('Home', 8100, 0);