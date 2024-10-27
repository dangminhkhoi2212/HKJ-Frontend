"use client";
import { App, Button, Table, TablePaginationConfig, Tag } from "antd";
import { TableProps } from "antd/lib";
import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

import { AUTHORIZATIONS_CONST, QUERY_CONST } from "@/const";
import { keyCloakService, userExtraService } from "@/services";
import { TAccountSync } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

const colorsTag = ["success", "processing", "error", "warning"];
type TAccountKeyCloak = TAccount[];
type TAccount = {
	id: string;
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	emailVerified: boolean;
	createdTimestamp: number;
	enabled: boolean;
	totp: boolean;
	disableableCredentialTypes: any[];
	requiredActions: any[];
	notBefore: number;
	access: Access;
	attributes?: Attributes;
	authorities?: string[];
};

export interface Access {
	manageGroupMembership: boolean;
	view: boolean;
	mapRoles: boolean;
	impersonate: boolean;
	manage: boolean;
}

export interface Attributes {
	sync?: string[];
	phoneNumber?: string[];
	addressString?: string[];
}

const AccountList: React.FC<{}> = () => {
	const columns: TableProps<TAccountSync>["columns"] = [
		{
			title: "Họ",
			dataIndex: "firstName",
			key: "firstName",
		},
		{
			title: "Tên",
			dataIndex: "lastName",
			key: "lastName",
		},
		{
			title: "Tên đăng nhập",
			dataIndex: "login",
			key: "login",
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
		{
			title: "Số điện thoại",
			dataIndex: "phone",
			key: "phone",
		},
		{
			title: "Vai trò",
			dataIndex: "authorities",
			key: "authorities",
			render(value, record, index) {
				return (
					<div className="inline-flex flex-col gap-1">
						{value?.map((v: string, i: number) => (
							<div key={i}>
								<Tag color={colorsTag[i % colorsTag.length]}>
									{v}
								</Tag>
							</div>
						))}
					</div>
				);
			},
		},
	];
	const [data, setData] = useState<TAccountSync[]>([]);
	console.log("🚀 ~ AccountList ~ data:", data);

	const [keyCloakData, setKeyCloakData] = useState<TAccountKeyCloak>([]);
	console.log("🚀 ~ AccountList ~ keyCloakData:", keyCloakData);

	const [pagination, setPagination] = useState<TablePaginationConfig>(
		QUERY_CONST.initPagination
	);

	const [query, setQuery] = useState({ page: 0 });

	const [loading, setLoading] = useState<boolean>(false);

	const { message } = App.useApp();
	const accountMapper = (accounts: TAccountKeyCloak) => {
		if (accounts.length === 0) return [];
		const newAccounts: TAccountSync[] = accounts.map((account) => {
			return {
				userId: account.id,
				login: account.username,
				firstName: account.firstName,
				lastName: account.lastName,
				email: account.email,
				address: account?.attributes?.addressString?.[0],
				phone: account.attributes?.phoneNumber?.[0],
				authorities: account.authorities,
			};
		});
		return newAccounts;
	};
	const getUsersQuery = useQuery({
		queryKey: ["keycloak-users", { ...query }],
		queryFn: () => keyCloakService.getUsers({}),
	});
	const findRoleForUsers = async (data: TAccountKeyCloak) => {
		console.log("🚀 ~ findRoleForUsers ~ call:");
		try {
			const result = await Promise.all(
				data.map(async (account) => {
					const roles = await getRoleUseMutation.mutateAsync(
						account.id
					);
					const roleUser = roles.filter((role: any) =>
						Object.values(
							AUTHORIZATIONS_CONST.AUTHORIZATIONS
						).includes(role.name)
					);
					return {
						...account,
						authorities: roleUser.map((r: any) => r.name),
					};
				})
			);
			setData(accountMapper(result));
		} catch (error) {
			console.error("Error fetching roles for users:", error);
		}
	};
	useEffect(() => {
		if (getUsersQuery.isSuccess) {
			const data: TAccountKeyCloak = getUsersQuery.data;
			console.log("🚀 ~ onSuccess ~ data:", data);
			setKeyCloakData(data);
			findRoleForUsers(data);
		}
	}, [getUsersQuery.data]);

	const getRoleUseMutation = useMutation({
		mutationFn: (id: string) => {
			return keyCloakService.getRoleUser(id);
		},
	});
	const getUsersCountQuery = useQuery({
		queryKey: ["keycloak-users-count", { ...query }],
		queryFn: () => keyCloakService.getUsersCount(query),
	});

	useEffect(() => {
		if (getUsersCountQuery.isSuccess) {
			const data = getUsersCountQuery.data;
			setPagination((pre) => ({ ...pre, total: data }));
		}
	}, [getUsersCountQuery.data]);

	const refresh = () => {
		getUsersQuery.refetch();
		getUsersCountQuery.refetch();
	};

	// useEffect(() => {
	// 	refresh();
	// }, []);

	const updateInKeyCloak = async () => {
		const updateAccountList = keyCloakData.map((account) => {
			const data: TAccount = {
				...account,
				attributes: { ...account.attributes, sync: ["true"] },
			};
			return keyCloakService.updateUser(account.id, data);
		});

		await Promise.all(updateAccountList);
	};
	const updateInHkj = async () => {
		const updateAccount = data.map((account) => {
			return userExtraService.create(account);
		});

		await Promise.all(updateAccount);
	};
	const handleSync = async () => {
		try {
			setLoading(true);
			await updateInKeyCloak();
			await updateInHkj();
			refresh();

			message.success("Đã đồng bộ thành công");
		} catch (error) {
			console.log("🚀 ~ handleSync ~ error:", error);
			message.error("Đã có lỗi xảy ra");
		}
		setLoading(false);
	};
	const handleTableChange: TableProps<TAccountSync>["onChange"] = (
		pagination
	) => {
		setQuery((pre) => ({ ...pre, page: pagination.current! - 1 }));
	};
	return (
		<div className="flex flex-col gap-4">
			<div className="flex justify-between items-center">
				<div>
					<Button
						onClick={() => refresh()}
						icon={<RotateCcw size={18} />}
					>
						Làm mới
					</Button>
				</div>
				<p>
					Đã tìm thấy{" "}
					<span className="font-bold">{pagination.total}</span> tài
					khoản chưa được đồng bộ
				</p>
				{pagination.total! > 0 && (
					<Button
						type="primary"
						onClick={() => handleSync()}
						loading={loading}
					>
						Đồng bộ ngay
					</Button>
				)}
			</div>
			<Table
				columns={columns}
				dataSource={data}
				rowKey="login"
				loading={{
					style: {},
					className: "absolute inset-0",
					spinning: getUsersQuery.isFetching,
				}}
				pagination={pagination}
				onChange={handleTableChange}
			/>
		</div>
	);
};

export default AccountList;
