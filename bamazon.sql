USE bamazon;

CREATE TABLE Products (
ItemID int NOT NULL,
ProductName varchar(50) NOT NULL,
DepartmentName varchar(50) NOT NULL,
Price DECIMAL(5,2) NOT NULL,
StockQuantity int NOT NULL);

INSERT INTO Products (ItemID, ProductName, DepartmentName, Price, StockQuantity)
VALUES (23576, 'KitchenAid Mixer', 'Home', 314.99, 50);

INSERT INTO Products (ItemID, ProductName, DepartmentName, Price, StockQuantity)
VALUES (58026,'Amazon Fire TV', 'Electronics', 89.99, 200);

INSERT INTO Products (ItemID, ProductName, DepartmentName, Price, StockQuantity)
VALUES (51948, 'Samsung 50-inch 1080p Smart LED TV', 'Electronics', 479.00, 25);

INSERT INTO Products (ItemID, ProductName, DepartmentName, Price, StockQuantity)
VALUES (38462, 'LEGO BATMAN MOVIE Batmobile Kit', 'Toys and Games', 139.95, 10);

INSERT INTO Products (ItemID, ProductName, DepartmentName, Price, StockQuantity)
VALUES (34958, 'Cards Against Humanity Game Set', 'Toys and Games', 29.99, 40);

INSERT INTO Products (ItemID, ProductName, DepartmentName, Price, StockQuantity)
VALUES (82469, 'Bic Round Medium Point Pens 35-Count', 'Office Supplies', 4.00, 400);

INSERT INTO Products (ItemID, ProductName, DepartmentName, Price, StockQuantity)
VALUES (86735, 'Five Star Flex Black NoteBinder', 'Office Supplies', 15.77, 200);

INSERT INTO Products (ItemID, ProductName, DepartmentName, Price, StockQuantity)
VALUES (14368, 'Kershaw 1990X Brawler', 'Sports & Outdoors', 21.88, 60);

INSERT INTO Products (ItemID, ProductName, DepartmentName, Price, StockQuantity)
VALUES (17593, 'Martini Golf Plastic Tees 5-Pack', 'Sports & Outdoors', 7.37, 230);

INSERT INTO Products (ItemID, ProductName, DepartmentName, Price, StockQuantity)
VALUES (26947, 'My Little Pony Aluminum Cake Pan', 'Home', 15.25, 15);

SELECT * FROM Products