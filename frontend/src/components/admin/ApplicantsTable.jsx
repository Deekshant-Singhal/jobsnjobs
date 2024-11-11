import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);

    // Custom order for status
    const statusOrder = {
        accepted: 1,
        pending: 2,
        rejected: 3,
    };

    const [filterStatus, setFilterStatus] = useState('all'); // Default filter to 'all'

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const filterApplicants = (data) => {
        if (filterStatus === 'all') {
            return data;
        }
        return data.filter((applicant) => applicant?.status?.toLowerCase() === filterStatus.toLowerCase());
    };

    const filteredApplicants = filterApplicants(applicants?.applications || []);

    // Function to count pending applicants
    const countPendingApplicants = (applicants) => {
        return applicants?.filter((applicant) => applicant?.status === 'pending').length || 0;
    };

    const countAcceptedApplicants = (applicants) => {
        return applicants?.filter((applicant) => applicant?.status === 'accepted').length || 0;
    };

    const countRejectedApplicants = (applicants) => {
        return applicants?.filter((applicant) => applicant?.status === 'rejected').length || 0;
    };

    // Get counts for each status
    const pendingCount = countPendingApplicants(filteredApplicants);
    const acceptedCount = countAcceptedApplicants(filteredApplicants);
    const rejectedCount = countRejectedApplicants(filteredApplicants);

    return (
        <div>
            <span className='text-gray-500'>
                Pending Applicants: {pendingCount} | Accepted Applicants: {acceptedCount} | Rejected Applicants: {rejectedCount}
            </span>
            <br />
            <hr />
            <br />
            <span> Filter By Status</span>
            <select className='float-right' onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
                <option value="all">All</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="pending">Pending</option>
            </select>
            <br /><br />
            <hr />
            <Table>
                <TableCaption>A list of your recent applied users</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredApplicants.length <= 0 ? (
                        <TableRow>
                            <TableCell colSpan={7}>No applicants available</TableCell>
                        </TableRow>
                    ) : (
                        filteredApplicants.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell>
                                    {item.applicant?.profile?.resume ? (
                                        <a className="text-blue-600 cursor-pointer" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">
                                            {item?.applicant?.profile?.resumeOriginalName}
                                        </a>
                                    ) : (
                                        <span>NA</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {item?.status === "accepted" ? (
                                        <span className="text-green-500">Accepted</span>
                                    ) : item?.status === "rejected" ? (
                                        <span className="text-red-500">Rejected</span>
                                    ) : (
                                        <span className="text-yellow-300">Pending</span>
                                    )}
                                </TableCell>
                                <TableCell>{item?.applicant.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="float-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            {shortlistingStatus.map((status, index) => (
                                                <div onClick={() => statusHandler(status, item?._id)} key={index} className="flex w-fit items-center my-2 cursor-pointer">
                                                    <span>{status}</span>
                                                </div>
                                            ))}
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default ApplicantsTable;
