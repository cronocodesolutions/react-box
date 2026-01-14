import { useState } from 'react';
import Box from '../../src/box';
import BaseSvg from '../../src/components/baseSvg';
import Button from '../../src/components/button';
import DataGrid from '../../src/components/dataGrid';
import Flex from '../../src/components/flex';
import { H4 } from '../../src/components/semantics';

type EnrollmentStatus = 'enrolled' | 'not_enrolled';
type FilterStatus = 'all' | 'enrolled' | 'not_enrolled';

interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  status: EnrollmentStatus;
}

const mockUsers: User[] = [
  { id: 1, name: 'Sarah Chen', email: 'sarah.chen@acme.io', department: 'Engineering', status: 'enrolled' },
  { id: 2, name: 'Marcus Johnson', email: 'marcus.j@acme.io', department: 'Security', status: 'enrolled' },
  { id: 3, name: 'Emily Rodriguez', email: 'emily.r@acme.io', department: 'Finance', status: 'not_enrolled' },
  { id: 4, name: 'David Kim', email: 'david.kim@acme.io', department: 'Engineering', status: 'enrolled' },
  { id: 5, name: 'Lisa Thompson', email: 'lisa.t@acme.io', department: 'HR', status: 'not_enrolled' },
  { id: 6, name: 'James Wilson', email: 'james.w@acme.io', department: 'Operations', status: 'enrolled' },
  { id: 7, name: 'Anna Martinez', email: 'anna.m@acme.io', department: 'Marketing', status: 'not_enrolled' },
  { id: 8, name: 'Robert Taylor', email: 'robert.t@acme.io', department: 'Security', status: 'enrolled' },
  { id: 9, name: 'Michelle Lee', email: 'michelle.l@acme.io', department: 'Engineering', status: 'enrolled' },
  { id: 10, name: 'Christopher Brown', email: 'chris.b@acme.io', department: 'Legal', status: 'not_enrolled' },
  { id: 11, name: 'Jennifer Davis', email: 'jennifer.d@acme.io', department: 'Finance', status: 'enrolled' },
  { id: 12, name: 'Daniel Garcia', email: 'daniel.g@acme.io', department: 'Engineering', status: 'not_enrolled' },
  { id: 13, name: 'Amanda White', email: 'amanda.w@acme.io', department: 'Security', status: 'enrolled' },
  { id: 14, name: 'Kevin Patel', email: 'kevin.p@acme.io', department: 'Engineering', status: 'enrolled' },
  { id: 15, name: 'Rachel Green', email: 'rachel.g@acme.io', department: 'Marketing', status: 'not_enrolled' },
  { id: 16, name: 'Steven Clark', email: 'steven.c@acme.io', department: 'Operations', status: 'enrolled' },
  { id: 17, name: 'Nicole Adams', email: 'nicole.a@acme.io', department: 'HR', status: 'enrolled' },
  { id: 18, name: 'Brandon Scott', email: 'brandon.s@acme.io', department: 'Engineering', status: 'not_enrolled' },
  { id: 19, name: 'Stephanie Hall', email: 'stephanie.h@acme.io', department: 'Finance', status: 'enrolled' },
  { id: 20, name: 'Andrew Lewis', email: 'andrew.l@acme.io', department: 'Security', status: 'enrolled' },
  { id: 21, name: 'Megan Turner', email: 'megan.t@acme.io', department: 'Legal', status: 'not_enrolled' },
  { id: 22, name: 'Joshua Wright', email: 'joshua.w@acme.io', department: 'Engineering', status: 'enrolled' },
  { id: 23, name: 'Lauren King', email: 'lauren.k@acme.io', department: 'Marketing', status: 'enrolled' },
  { id: 24, name: 'Ryan Mitchell', email: 'ryan.m@acme.io', department: 'Operations', status: 'not_enrolled' },
  { id: 25, name: 'Samantha Young', email: 'samantha.y@acme.io', department: 'Engineering', status: 'enrolled' },
  { id: 26, name: 'Justin Moore', email: 'justin.m@acme.io', department: 'Security', status: 'enrolled' },
  { id: 27, name: 'Ashley Nelson', email: 'ashley.n@acme.io', department: 'HR', status: 'not_enrolled' },
  { id: 28, name: 'Tyler Harris', email: 'tyler.h@acme.io', department: 'Finance', status: 'enrolled' },
  { id: 29, name: 'Brittany Carter', email: 'brittany.c@acme.io', department: 'Engineering', status: 'not_enrolled' },
  { id: 30, name: 'Nathan Phillips', email: 'nathan.p@acme.io', department: 'Legal', status: 'enrolled' },
  { id: 31, name: 'Kayla Evans', email: 'kayla.e@acme.io', department: 'Marketing', status: 'enrolled' },
  { id: 32, name: 'Derek Collins', email: 'derek.c@acme.io', department: 'Security', status: 'not_enrolled' },
  { id: 33, name: 'Heather Stewart', email: 'heather.s@acme.io', department: 'Operations', status: 'enrolled' },
  { id: 34, name: 'Jason Murphy', email: 'jason.m@acme.io', department: 'Engineering', status: 'enrolled' },
  { id: 35, name: 'Christina Rivera', email: 'christina.r@acme.io', department: 'Finance', status: 'not_enrolled' },
  { id: 36, name: 'Adam Cooper', email: 'adam.c@acme.io', department: 'HR', status: 'enrolled' },
  { id: 37, name: 'Vanessa Reed', email: 'vanessa.r@acme.io', department: 'Security', status: 'enrolled' },
  { id: 38, name: 'Eric Bailey', email: 'eric.b@acme.io', department: 'Engineering', status: 'not_enrolled' },
  { id: 39, name: 'Melissa Bell', email: 'melissa.b@acme.io', department: 'Marketing', status: 'enrolled' },
  { id: 40, name: 'Gregory Howard', email: 'gregory.h@acme.io', department: 'Legal', status: 'not_enrolled' },
  { id: 41, name: 'Tiffany Ward', email: 'tiffany.w@acme.io', department: 'Operations', status: 'enrolled' },
  { id: 42, name: 'Patrick Torres', email: 'patrick.t@acme.io', department: 'Security', status: 'enrolled' },
  { id: 43, name: 'Alexandra Peterson', email: 'alexandra.p@acme.io', department: 'Engineering', status: 'enrolled' },
  { id: 44, name: 'Sean Gray', email: 'sean.g@acme.io', department: 'Finance', status: 'not_enrolled' },
  { id: 45, name: 'Monica James', email: 'monica.j@acme.io', department: 'HR', status: 'enrolled' },
  { id: 46, name: 'Kyle Watson', email: 'kyle.w@acme.io', department: 'Engineering', status: 'not_enrolled' },
  { id: 47, name: 'Diana Brooks', email: 'diana.b@acme.io', department: 'Security', status: 'enrolled' },
  { id: 48, name: 'Travis Sanders', email: 'travis.s@acme.io', department: 'Marketing', status: 'enrolled' },
  { id: 49, name: 'Rebecca Price', email: 'rebecca.p@acme.io', department: 'Operations', status: 'not_enrolled' },
  { id: 50, name: 'Joel Bennett', email: 'joel.b@acme.io', department: 'Legal', status: 'enrolled' },
  { id: 51, name: 'Natalie Ross', email: 'natalie.r@acme.io', department: 'Engineering', status: 'enrolled' },
  { id: 52, name: 'Chad Foster', email: 'chad.f@acme.io', department: 'Security', status: 'not_enrolled' },
  { id: 53, name: 'Amber Powell', email: 'amber.p@acme.io', department: 'Finance', status: 'enrolled' },
  { id: 54, name: 'Brett Long', email: 'brett.l@acme.io', department: 'HR', status: 'enrolled' },
  { id: 55, name: 'Courtney Hughes', email: 'courtney.h@acme.io', department: 'Engineering', status: 'not_enrolled' },
  { id: 56, name: 'Dustin Flores', email: 'dustin.f@acme.io', department: 'Marketing', status: 'enrolled' },
  { id: 57, name: 'Erica Washington', email: 'erica.w@acme.io', department: 'Operations', status: 'enrolled' },
  { id: 58, name: 'Frank Butler', email: 'frank.b@acme.io', department: 'Security', status: 'not_enrolled' },
  { id: 59, name: 'Grace Simmons', email: 'grace.s@acme.io', department: 'Legal', status: 'enrolled' },
  { id: 60, name: 'Henry Foster', email: 'henry.f@acme.io', department: 'Engineering', status: 'enrolled' },
  { id: 61, name: 'Irene Gonzalez', email: 'irene.g@acme.io', department: 'Finance', status: 'not_enrolled' },
  { id: 62, name: 'Jack Reynolds', email: 'jack.r@acme.io', department: 'Security', status: 'enrolled' },
  { id: 63, name: 'Katherine Hayes', email: 'katherine.h@acme.io', department: 'HR', status: 'enrolled' },
  { id: 64, name: 'Lance Perry', email: 'lance.p@acme.io', department: 'Engineering', status: 'not_enrolled' },
  { id: 65, name: 'Martha Sullivan', email: 'martha.s@acme.io', department: 'Marketing', status: 'enrolled' },
  { id: 66, name: 'Norman Russell', email: 'norman.r@acme.io', department: 'Operations', status: 'enrolled' },
  { id: 67, name: 'Olivia Griffin', email: 'olivia.g@acme.io', department: 'Legal', status: 'not_enrolled' },
  { id: 68, name: 'Peter Diaz', email: 'peter.d@acme.io', department: 'Security', status: 'enrolled' },
  { id: 69, name: 'Quinn Hayes', email: 'quinn.h@acme.io', department: 'Engineering', status: 'enrolled' },
  { id: 70, name: 'Rosa Myers', email: 'rosa.m@acme.io', department: 'Finance', status: 'not_enrolled' },
  { id: 71, name: 'Samuel Ford', email: 'samuel.f@acme.io', department: 'HR', status: 'enrolled' },
  { id: 72, name: 'Teresa Hamilton', email: 'teresa.h@acme.io', department: 'Engineering', status: 'not_enrolled' },
  { id: 73, name: 'Ulysses Graham', email: 'ulysses.g@acme.io', department: 'Security', status: 'enrolled' },
  { id: 74, name: 'Victoria Alexander', email: 'victoria.a@acme.io', department: 'Marketing', status: 'enrolled' },
  { id: 75, name: 'Walter Freeman', email: 'walter.f@acme.io', department: 'Operations', status: 'not_enrolled' },
  { id: 76, name: 'Xena Webb', email: 'xena.w@acme.io', department: 'Legal', status: 'enrolled' },
  { id: 77, name: 'Yolanda Tucker', email: 'yolanda.t@acme.io', department: 'Engineering', status: 'enrolled' },
  { id: 78, name: 'Zachary Burns', email: 'zachary.b@acme.io', department: 'Security', status: 'not_enrolled' },
  { id: 79, name: 'Alicia Crawford', email: 'alicia.c@acme.io', department: 'Finance', status: 'enrolled' },
  { id: 80, name: 'Bernard Owens', email: 'bernard.o@acme.io', department: 'HR', status: 'enrolled' },
  { id: 81, name: 'Cynthia Stone', email: 'cynthia.s@acme.io', department: 'Engineering', status: 'not_enrolled' },
  { id: 82, name: 'Douglas Cole', email: 'douglas.c@acme.io', department: 'Marketing', status: 'enrolled' },
  { id: 83, name: 'Eleanor Jordan', email: 'eleanor.j@acme.io', department: 'Operations', status: 'enrolled' },
  { id: 84, name: 'Felix Warren', email: 'felix.w@acme.io', department: 'Security', status: 'not_enrolled' },
  { id: 85, name: 'Gloria Dixon', email: 'gloria.d@acme.io', department: 'Legal', status: 'enrolled' },
  { id: 86, name: 'Harold Ramos', email: 'harold.r@acme.io', department: 'Engineering', status: 'enrolled' },
  { id: 87, name: 'Isabelle Hunt', email: 'isabelle.h@acme.io', department: 'Finance', status: 'not_enrolled' },
  { id: 88, name: 'Jerome Palmer', email: 'jerome.p@acme.io', department: 'Security', status: 'enrolled' },
  { id: 89, name: 'Kelly Dunn', email: 'kelly.d@acme.io', department: 'HR', status: 'enrolled' },
  { id: 90, name: 'Leonard Pierce', email: 'leonard.p@acme.io', department: 'Engineering', status: 'not_enrolled' },
  { id: 91, name: 'Marissa Arnold', email: 'marissa.a@acme.io', department: 'Marketing', status: 'enrolled' },
  { id: 92, name: 'Nelson Shaw', email: 'nelson.s@acme.io', department: 'Operations', status: 'enrolled' },
  { id: 93, name: 'Oscar Weaver', email: 'oscar.w@acme.io', department: 'Legal', status: 'not_enrolled' },
  { id: 94, name: 'Paige Hunter', email: 'paige.h@acme.io', department: 'Security', status: 'enrolled' },
  { id: 95, name: 'Quentin Hicks', email: 'quentin.h@acme.io', department: 'Engineering', status: 'enrolled' },
  { id: 96, name: 'Regina Nichols', email: 'regina.n@acme.io', department: 'Finance', status: 'not_enrolled' },
  { id: 97, name: 'Stanley Medina', email: 'stanley.m@acme.io', department: 'HR', status: 'enrolled' },
  { id: 98, name: 'Tara Simpson', email: 'tara.s@acme.io', department: 'Engineering', status: 'not_enrolled' },
  { id: 99, name: 'Vincent Gordon', email: 'vincent.g@acme.io', department: 'Security', status: 'enrolled' },
  { id: 100, name: 'Wendy Castro', email: 'wendy.c@acme.io', department: 'Marketing', status: 'enrolled' },
];

function KeyIcon({ size = 16 }: { size?: number }) {
  return (
    <BaseSvg viewBox="0 0 24 24" width={`${size}`} height={`${size}`} fill="none" stroke="currentColor">
      <path
        strokeWidth={2}
        d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"
      />
    </BaseSvg>
  );
}

function ShieldIcon({ size = 20 }: { size?: number }) {
  return (
    <BaseSvg viewBox="0 0 24 24" width={`${size}`} height={`${size}`} fill="none" stroke="currentColor">
      <path strokeWidth={2} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </BaseSvg>
  );
}

function StatusBadge({ status }: { status: EnrollmentStatus }) {
  const isEnrolled = status === 'enrolled';

  return (
    <Flex
      ai="center"
      gap={1.5}
      px={2.5}
      py={1}
      borderRadius={1}
      fontSize={12}
      fontWeight={500}
      bgColor={isEnrolled ? 'emerald-950' : 'slate-800'}
      color={isEnrolled ? 'emerald-400' : 'slate-400'}
      b={1}
      borderColor={isEnrolled ? 'emerald-800' : 'slate-700'}
    >
      <Box
        width={6}
        height={6}
        borderRadius={999}
        bgColor={isEnrolled ? 'emerald-500' : 'slate-600'}
        shadow={isEnrolled ? 'small' : 'none'}
      />
      {isEnrolled ? 'Enrolled' : 'Not Enrolled'}
    </Flex>
  );
}

function ActionButton({ status, onAction }: { status: EnrollmentStatus; onAction: () => void }) {
  const isEnrolled = status === 'enrolled';

  return (
    <Button
      onClick={onAction}
      px={3}
      py={1.5}
      borderRadius={1}
      fontSize={12}
      fontWeight={500}
      b={1}
      transition="all"
      transitionDuration={150}
      bgColor={isEnrolled ? 'transparent' : 'cyan-950'}
      color={isEnrolled ? 'red-400' : 'cyan-400'}
      borderColor={isEnrolled ? 'red-800' : 'cyan-800'}
      hover={{
        bgColor: isEnrolled ? 'red-950' : 'cyan-900',
        borderColor: isEnrolled ? 'red-700' : 'cyan-700',
      }}
    >
      <Flex ai="center" gap={1.5}>
        <KeyIcon size={14} />
        {isEnrolled ? 'Revoke Key' : 'Enroll Key'}
      </Flex>
    </Button>
  );
}

function StatusFilter({ value, onChange }: { value: FilterStatus; onChange: (status: FilterStatus) => void }) {
  const options: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'enrolled', label: 'Enrolled' },
    { value: 'not_enrolled', label: 'Not Enrolled' },
  ];

  return (
    <Flex ai="center" gap={1} p={1} bgColor="slate-800" borderRadius={1.5}>
      {options.map((option) => (
        <Button
          key={option.value}
          onClick={() => onChange(option.value)}
          px={3}
          py={1.5}
          borderRadius={1}
          fontSize={12}
          fontWeight={500}
          b={0}
          bgColor={value === option.value ? 'cyan-900' : 'transparent'}
          color={value === option.value ? 'cyan-300' : 'slate-400'}
          hover={{
            color: value === option.value ? 'cyan-300' : 'slate-200',
          }}
        >
          {option.label}
        </Button>
      ))}
    </Flex>
  );
}

export default function FidoEnrollmentPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');

  const filteredUsers = users.filter((user) => {
    if (statusFilter === 'all') return true;
    return user.status === statusFilter;
  });

  const handleAction = (userId: number) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, status: user.status === 'enrolled' ? 'not_enrolled' : 'enrolled' } : user)),
    );
  };

  const enrolledCount = users.filter((u) => u.status === 'enrolled').length;
  const totalCount = users.length;

  return (
    <Box>
      {/* Header */}
      <Flex ai="center" jc="space-between" mb={6} pb={6} bb={1} borderColor="slate-800">
        <Flex ai="center" gap={4}>
          <Flex
            ai="center"
            jc="center"
            width={12}
            height={12}
            borderRadius={2}
            bgColor="cyan-950"
            color="cyan-400"
            b={1}
            borderColor="cyan-800"
          >
            <ShieldIcon />
          </Flex>
          <Box>
            <Box fontSize={24} fontWeight={700} color="slate-100" mb={1}>
              FIDO Key Enrollment
            </Box>
            <Flex ai="center" gap={3}>
              <Box fontSize={13} color="slate-500">
                Manage hardware security keys for your organization
              </Box>
              <Flex ai="center" gap={1.5} px={2} py={0.5} bgColor="slate-800" borderRadius={1} fontSize={11} color="slate-400">
                <Box width={5} height={5} borderRadius={999} bgColor="emerald-500" />
                {enrolledCount}/{totalCount} enrolled
              </Flex>
            </Flex>
          </Box>
        </Flex>
      </Flex>

      <DataGrid
        data={filteredUsers}
        def={{
          rowKey: 'id',
          topBar: true,
          title: <H4>FIDO Key Enrollment</H4>,
          globalFilter: true,
          topBarContent: <StatusFilter value={statusFilter} onChange={setStatusFilter} />,
          columns: [
            {
              key: 'name',
              header: 'Employee',
              width: 200,
              Cell: ({ cell }) => (
                <Flex ai="center" gap={3} px={2} overflow="hidden">
                  <Flex borderRadius={999} bgColor="slate-700" color="slate-300" fontSize={12} fontWeight={600}>
                    <Flex width={8} height={8} ai="center" jc="center">
                      {cell.row.data.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </Flex>
                  </Flex>
                  <Box textOverflow="ellipsis" textWrap="nowrap">
                    <Box fontWeight={500} color="slate-200">
                      {cell.row.data.name}
                    </Box>
                    <Box fontSize={11} color="slate-500">
                      {cell.row.data.department}
                    </Box>
                  </Box>
                </Flex>
              ),
            },
            {
              key: 'email',
              header: 'Email',
              width: 250,
              flexible: false,
              Cell: ({ cell }) => (
                <Box color="slate-400" textOverflow="ellipsis" overflow="hidden" textWrap="nowrap" px={3} fontSize={13}>
                  {cell.row.data.email}
                </Box>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              width: 140,
              Cell: ({ cell }) => <StatusBadge status={cell.row.data.status} />,
            },
            {
              key: 'actions',
              header: 'Actions',
              width: 140,
              Cell: ({ cell }) => <ActionButton status={cell.row.data.status} onAction={() => handleAction(cell.row.data.id)} />,
            },
          ],
          rowHeight: 64,
          visibleRowsCount: 10,
        }}
      />
    </Box>
  );
}
